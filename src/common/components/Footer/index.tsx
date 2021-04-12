import React from 'react';
import "./footer.css";
import { Icon } from 'rsuite';

export const KAIFooter = () => {
    return (
        <div className="kai-footer">
            <div className="footer-container">
                <div>
                    Copyright © 2020 KardiaChain Foundation
                </div>
                <div>
                    <a href="https://medium.com/kardiachain" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="medium" size={"lg"} /></a>
                    <a href="https://twitter.com/KardiaChain" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="twitter" size={"lg"} /></a>
                    <a href="https://t.me/kardiachain" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="telegram" size={"lg"} /></a>
                    <a href="https://www.facebook.com/KardiaChainFoundation/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="facebook" size={"lg"} /></a>
                    <a href="https://www.instagram.com/kardiachainofficial/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="instagram" size={"lg"} /></a>
                    <a href="https://www.youtube.com/channel/UC51X-DS1VBqzVhd8UU4Aymg" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="youtube" size={"lg"} /></a>
                    <a href="https://www.reddit.com/r/KardiaChain/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="reddit" size={"lg"} /></a>
                    <a href="https://www.linkedin.com/company/kardiachain/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="linkedin" size={"lg"} /></a>
                </div>
            </div>
        </div>
    )
}