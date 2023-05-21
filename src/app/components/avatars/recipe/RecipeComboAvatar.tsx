import { Button, Grid } from "semantic-ui-react";

import "./RecipeComboAvatar.scss";
import { MWRecipe } from "../../../../lib/types/recipe";
import { EntityAvatar } from "../entity/EntityAvatar";
import { MWItem } from "../../../../lib/types/item";
import { round } from "../../../../lib/types/util";
import { ItemAvatar } from "../entity/ItemAvatar";

interface RecipeComboAvatarPros {
    rank: number;
    cost: number;
    recipe: MWRecipe;
    expanded: boolean;
    onExpand: (value: boolean) => void;
}

export function RecipeComboAvatar (props: RecipeComboAvatarPros) {
    let item = props.recipe.result as MWItem;
    let artisan = props.recipe.artisan!;
    let tool = props.recipe.tool!;
    let supplement = props.recipe.supplement!;

    let totalProficiency = artisan.proficiency + tool.proficiency + supplement.proficiency;
    let totalFocus = artisan.focus + tool.focus + supplement.focus;

    return (
    <Grid className="RecipeComboAvatar">
        <Grid.Column width={1}>
            <p className="centered-element">
                {`${props.rank}.`}
            </p>
        </Grid.Column>
        <Grid.Column width={3}>
            <EntityAvatar size={"medium"} entity={props.recipe.artisan} />
        </Grid.Column>
        <Grid.Column width={3}>
            <EntityAvatar size={"medium"} entity={props.recipe.tool} />
        </Grid.Column>
        <Grid.Column width={3}>
            <EntityAvatar size={"medium"} entity={props.recipe.supplement} />
        </Grid.Column>
        <Grid.Column width={2}>
            <div className="centered-element" style={{width: "100%"}}>
                <p>{`+1: ${Math.round(props.recipe.highQualityResults * 100) / 100}`}</p>
                <p>{`Normal: ${Math.round(props.recipe.normalResults * 100) / 100}`}</p>
            </div>
        </Grid.Column>
        <Grid.Column width={2}>
            <div className="centered-element" style={{width: "100%"}}>
                <p>Overall Cost:</p>
                <p>{`${Math.round(props.cost).toLocaleString("en-US")} AD`}</p>
            </div>
        </Grid.Column>
        <Grid.Column width={2}>
            <Button basic color="black" style={{fontSize: "0.8rem"}}
                    className="centered-element"
                    onClick={() => props.onExpand(!props.expanded)}
            >
                { props.expanded? "Hide" : "Expand" }
            </Button>
        </Grid.Column>
        { props.expanded && 
            <div style={{width: "100%", marginBottom: "64px", marginTop: "32px"}}>
                <p>
                    {
                        `${totalProficiency}/${item.proficiency} Proficiency =`
                      + ` ${round(props.recipe.successChance * 100, 2)}% chance to succeed`
                    }
                </p>
                <p>
                    {
                        `${totalFocus}/${item.focus} Focus =`
                      + ` ${round(props.recipe.highQualityChance * 100, 2)}% chance to +1`
                    }
                </p>
                <p>
                    {
                        `Dab Hand chance: ${round(props.recipe.totalDabHandChance * 100, 2)}%`
                      + ` | Recycle chance: ${round(props.recipe.totalRecycleChance * 100, 2)}%`
                    }
                </p>
                <p style={{marginTop: "32px"}}>
                    {
                        `${round(props.recipe.attempts, 2)} Attempts Needed`
                      + ` | ${round(props.recipe.highQualityResults, 2)} High Quality Results`
                      + ` | ${round(props.recipe.normalResults, 2)} Normal Results`
                      + ` | ${round(props.recipe.failures, 2)} Failures`
                      + ` | ${round(props.recipe.failures * props.recipe.totalRecycleChance, 2)} Recycles`
                    }
                </p>
                <p style={{marginTop: "32px"}}>Total Base Resources Consumed:</p>
                {
                    props.recipe.materials.map(value => 
                        <ItemAvatar
                            quantity={round(value[0], 2)}
                            itemName={value[1]}
                        />
                    )
                }
                <p style={{marginTop: "32px"}}>Total Supplements Consumed:</p>
                {
                    props.recipe.supplements.map(value => 
                        <ItemAvatar
                            quantity={round(value[0], 2)}
                            itemName={value[1]}
                        />
                    )
                }
                <p style={{marginTop: "32px"}}>Material Cost of All Consumed Supplements:</p>
                {
                    props.recipe.supplementMaterials.map(value => 
                        <ItemAvatar
                            quantity={round(value[0], 2)}
                            itemName={value[1]}
                        />
                    )
                }
                <p>Overall Cost: {`${Math.round(props.cost).toLocaleString("en-US")} AD`}</p>
            </div>
        }
    </Grid>
    )
}