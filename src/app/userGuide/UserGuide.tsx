import { Component } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import img from '../../images/user guide/InitialView.png';

const userGuideContent = `
# some content
<img src="${img}" alt="another-img" width="840px" />
`;

export default class UserGuidePage extends Component<{}, {}> {
    render() {
        return (
            <div className={`Panel`} id="user-guide">
                <h1 style={{ padding: "16px"}}>User Guide</h1>
                <Markdown rehypePlugins={[rehypeRaw]}>{userGuideContent}</Markdown>
            </div>
        );
    }
}