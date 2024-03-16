import React from "react";
import "./Footer.scss";
import { VERSION_NUMBER } from "../../constants";

interface FooterProps {
    setPage: (page: string) => void;
}

/**
 * Footer for every page. Contains links and info
 */
export default function Footer(props: FooterProps)
{
    return(
    <div className="Footer">
        <div>
            <a onClick={() => props.setPage("calculator")} style={{cursor: "pointer"}}>Home</a>
            {" . "}
            <a onClick={() => props.setPage("settings")} style={{cursor: "pointer"}}>Settings</a>
        </div>
        <div>
            <p>
                {`Neverwinter Craft Calculator ${VERSION_NUMBER} created by dalmposter`}
                { /* <a href="https://github.com/dalmposter">@github/dalmposter</a> */ }
            </p>
        </div>
    </div>
    );
}