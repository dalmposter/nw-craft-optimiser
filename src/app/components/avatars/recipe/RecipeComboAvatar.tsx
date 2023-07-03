import { Button, Grid } from "semantic-ui-react";

import "./RecipeComboAvatar.scss";
import { MWRecipe } from "../../../../lib/types/recipe";
import { EntityAvatar } from "../entity/EntityAvatar";
import { MWItem } from "../../../../lib/types/item";
import { findMwObject, round } from "../../../../lib/types/util";
import { ItemAvatar } from "../entity/ItemAvatar";

interface RecipeComboAvatarPros {
    rank: number;
    cost: number;
    recipe: MWRecipe;
    expanded: boolean;
    onExpand: (value: boolean) => void;
    onItemClick: (name: string) => void;
}

export function RecipeComboAvatar (props: RecipeComboAvatarPros) {
    console.debug(`Supplements:`, props.recipe.supplements)
    let item = props.recipe.result as MWItem;
    let artisan = props.recipe.artisan!;
    let tool = props.recipe.tool!;
    let supplement = props.recipe.supplement!;

    let totalProficiency = artisan.proficiency + tool.proficiency + supplement.proficiency;
    let totalFocus = artisan.focus + tool.focus + supplement.focus;

    let formattedCost = Math.round(props.cost).toLocaleString("en-US");

    return (
    <Grid className="RecipeComboAvatar">
        <Grid.Row>
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
            <div className="centered-element" style={{width: "100%", textAlign: "center"}}>
                <p>{`+1: ${Math.round(props.recipe.highQualityResults * 100) / 100}`}</p>
                <p>{`Normal: ${Math.round(props.recipe.normalResults * 100) / 100}`}</p>
            </div>
        </Grid.Column>
        <Grid.Column width={2}>
            <div className="centered-element" style={{width: "100%", textAlign: "center"}}>
                <p>Overall Cost:</p>
                <p>{`${formattedCost} AD`}</p>
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
        </Grid.Row>
        { props.expanded &&
        <>
            <Grid.Row>
                <Grid.Column width={1} />
                <Grid.Column width={7}>
                    <h4>Combo Stats:</h4>
                    <p>
                        {
                            `${totalProficiency}/${item.proficiency} Proficiency =`
                        + ` ${round(props.recipe.successChance * 100, 2)}% chance to succeed`
                        }
                    </p>
                    <p>
                        {
                            `${totalFocus}/${item.focus} Focus =`
                        + ` ${round(props.recipe.highQualityChance * 100, 2)}% chance to obtain +1`
                        }
                    </p>
                    <p>
                        {
                            `Dab Hand chance: ${round(props.recipe.totalDabHandChance * 100, 2)}%`
                        + ` | Recycle chance: ${round(props.recipe.totalRecycleChance * 100, 2)}%`
                        }
                    </p>
                </Grid.Column>
                <Grid.Column width={7}>
                    <h4>Total Supplements Consumed:</h4>
                    {
                        props.recipe.supplements
                            .sort(([quantityA, supplementA], [quantityB, supplementB]) => quantityB - quantityA)
                            .map((value, index) => 
                                <ItemAvatar
                                    highQuality={value[1].split("+1").length > 1}
                                    quantity={round(value[0], 2)}
                                    item={findMwObject(value[1])}
                                    onClick={props.onItemClick}
                                    key={`item-avatar-${value}-${index}`}
                                />
                            )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={1} />
                <Grid.Column width={7}>
                    <h4>Resources Needed to Craft All Ingredients:</h4>
                    {
                        props.recipe.materials
                            .sort(([quantityA, _A], [quantityB, _B]) => quantityB - quantityA)
                            .map(value => 
                                <ItemAvatar
                                    highQuality={value[1].split("+1").length > 1}
                                    quantity={round(value[0], 2)}
                                    item={findMwObject(value[1])}
                                    onClick={props.onItemClick}
                                />
                            )
                    }
                </Grid.Column>
                <Grid.Column width={7}>
                    <h4>Resources Needed to Craft All Supplements:</h4>
                    {
                        props.recipe.supplementMaterials
                            .sort(([quantityA, _A], [quantityB, _B]) => quantityB - quantityA)
                            .map(value => 
                                <ItemAvatar
                                    quantity={round(value[0], 2)}
                                    item={findMwObject(value[1])}
                                    onClick={props.onItemClick}
                                />
                            )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={1} />
                <Grid.Column width={9}>
                    <div style={{width: "100%", textAlign: "left"}}>
                        <p>
                            <b>
                                {`${round(props.recipe.attempts, 2)} Attempts:`}
                            </b>
                            {` ${round(props.recipe.highQualityResults, 2)} High Quality Results,`
                            +` ${round(props.recipe.normalResults, 2)} Normal Results`}
                        </p>
                    </div>
                </Grid.Column>
                <Grid.Column width={5}>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <p>
                            {`${round(props.recipe.failures, 2)} Failures,`
                            +` ${round(props.recipe.failures * props.recipe.totalRecycleChance, 2)} Recycles`
                            }
                        </p>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="no-top-padding">
                <Grid.Column width={1} />
                <Grid.Column width={14}>
                    <p style={{marginBottom: "32px"}}><b>Total Cost: {formattedCost} AD</b></p>
                </Grid.Column>
            </Grid.Row>
        </>
        }
    </Grid>
    )
}