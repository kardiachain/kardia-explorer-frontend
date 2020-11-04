import React from 'react';
import "./footer.css";
import { Icon } from 'rsuite';

const Footer = () => {
    return (
        <div className="kai-footer">
            <div>
                Copyright © 2020 KardiaChain Foundation | All rights reserved
            </div>
            <div>
                <a href="#" className="footer-icon" ><Icon icon="medium" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="twitter" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="telegram" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="facebook" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="instagram" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="youtube" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="reddit" size={"lg"} /></a>
                <a href="#" className="footer-icon" ><Icon icon="linkedin" size={"lg"} /></a>
            </div>
        </div>
    )
}

export default Footer;