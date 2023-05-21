import React from "react";
import "./Footer.scss";

/**
 * Footer for every page. Contains links and info
 */
export default function Footer()
{
    return(
    <div className="Footer">
        <div>
            <a href={process.env.PUBLIC_URL}>Home</a>
            {" . "}
            <a href={process.env.PUBLIC_URL}>Home</a>
        </div>
        <div>
            <p>
                {"Neverwinter Craft Calculator created by dalmposter"}
                { /* <a href="https://github.com/dalmposter">@github/dalmposter</a> */ }
            </p>
        </div>
    </div>
    );
}