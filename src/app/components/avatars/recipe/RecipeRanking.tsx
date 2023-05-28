import { DividerProps } from "semantic-ui-react";
import { MWRecipe } from "../../../../lib/types/recipe"
import { RecipeComboAvatar } from "./RecipeComboAvatar"
import { useState } from "react";

interface RecipeRankingProps extends React.HTMLAttributes<HTMLDivElement> {
    orderedRecipes: [MWRecipe, number][];
    onItemClick: (name: string) => void;
}

export function RecipeRanking (props: RecipeRankingProps) {
    const [expandedCombo, setExpandedCombo] = useState(0)

    return (
    <div className="RecipeRanking" {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {props.orderedRecipes.map(
            (value, index) => {
                return <RecipeComboAvatar
                    rank={index + 1}
                    cost={value[1]}
                    recipe={value[0]}
                    key={`craftCalc-rcAvatar-${index}`}
                    expanded={index + 1 == expandedCombo}
                    onExpand={(value: boolean) => {
                        value? setExpandedCombo(index + 1) : setExpandedCombo(0)
                    }}
                    onItemClick={props.onItemClick}
                />
            }
        )}
    </div>
    )
}