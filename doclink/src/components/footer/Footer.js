import React from 'react'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
function Footer() {
  return (
    <div className='footer' style={{left: 0, bottom: 0, backgroundColor:"#F49696"}}>
    <div class="container">
    <div className='row'>
      <div className='col-3 col-md-4 col-sm-3' style={{textAlign:"center"}}>
        <label style={{color:"#030E82", fontWeight:"bold"}}>Social media Links</label>
        <br/>
        <InstagramIcon style={{color:"#030E82", marginTop:"10px", cursor:"pointer"}}/>
        <FacebookIcon style={{color:"#030E82", marginTop:"10px", cursor:"pointer"}}/>
        <LinkedInIcon style={{color:"#030E82", marginTop:"10px", cursor:"pointer"}}/>
        <XIcon style={{color:"#030E82", marginTop:"10px", cursor:"pointer"}}/>


      </div>
      <div className='col-1 col-md-4 col-sm-1' style={{textAlign:"center"}}>
      <label style={{color:"#030E82", fontWeight:"bold"}}>Links</label>
      <br/>
      <label style={{color:"#030E82", cursor:"pointer"}}>About Us</label>
      <br/>
      <label style={{color:"#030E82", cursor:"pointer"}}>FAQs</label>

      </div>
      <div className='col-8 col-md-4 col-sm-8' style={{textAlign:"center"}}>
      <label style={{color:"#030E82", fontWeight:"bold"}}>Contact Information</label>
      <br/>
      <p style={{color:"#030E82", fontSize:"12px"}}>Email: support@doclink.com<br/>
            Phone: +1-800-123-4567 <br/>
            Live Chat: Link to customer support chat. <br/>
            Address (if applicable): 1234 Health Street, City, Country.</p>
      

      </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-12 col-sm-12' style={{textAlign:"center"}}>
        <label style={{color:"#030E82"}}>© 2024 DocLink. All rights reserved.</label>
        </div>
      </div>
      </div>
    </div>
    
  )
}

export default Footer