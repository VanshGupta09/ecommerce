import { Stack } from '@mui/material'
import React from 'react'
import playStore from "../images/playstore.png"
import appStore from "../images/Appstore.png"

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <Stack flexDirection={"row"} className="footer-content" justifyContent={"space-between"} alignItems={"baseline"}>
                    <div className='left-footer'>
                        <h4>Download our app</h4>
                        <p>Download App for Android and IOS mobile phone</p>
                        <img src={playStore} alt="playstore" />
                        <img src={appStore} alt="appstore" />
                    </div>
                    <div className='mid-footer'>
                        <h2>ECOMMERCE</h2>
                        <p>High quality is our first priority</p>
                        <p>Copyrights 2024 &copy; Vansh Gupta</p>
                    </div>
                    <div className='right-footer'>
                        <h4>Follow Us</h4>
                        <a href="https://www.linkedin.com/in/vansh-gupta-886b74243/" target='_blank'>Linkedin</a>
                        <a href="https://github.com/VanshGupta09" target='_blank'>Github</a>
                        <a href="https://www.instagram.com/the.vansh.gupta/" target='_blank'>Instagram</a>
                    </div>
                </Stack>
            </div>
        </div>
    )
}

export default Footer