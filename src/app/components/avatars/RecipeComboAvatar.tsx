import { Button, Grid } from "semantic-ui-react";
import { MWRecipe } from "../../../lib/types/recipe";
import { EntityAvatar } from "./EntityAvatar";

import "./RecipeComboAvatar.scss";

interface RecipeComboAvatarPros {
    rank: number;
    cost: number;
    recipe: MWRecipe;
}

export function RecipeComboAvatar (props: RecipeComboAvatarPros) {
    return (
    <Grid className="RecipeComboAvatar">
        <Grid.Column width={1}>
            <p className="centered-element">
                {`${props.rank}.`}
            </p>
        </Grid.Column>
        <Grid.Column width={3}>
            <EntityAvatar entity={props.recipe.artisan} />
        </Grid.Column>
        <Grid.Column width={3}>
            <EntityAvatar entity={props.recipe.tool} />
        </Grid.Column>
        <Grid.Column width={3}>
            <EntityAvatar entity={props.recipe.supplement} />
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
            <p>{`${props.recipe.attempts} Attempts`}</p>
            <Button basic color="black" style={{fontSize: "0.8rem"}} className="centered-element">
                Expand
            </Button>
        </Grid.Column>
    </Grid>
    )
}