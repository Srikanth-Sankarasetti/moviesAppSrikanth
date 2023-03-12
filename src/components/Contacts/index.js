import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Contacts = () => (
  <div className="contact-container">
    <div className="contact-icons">
      <FaGoogle size={20} />
      <FaTwitter size={20} />
      <FaInstagram size={20} />
      <FaYoutube size={20} />
    </div>
    <p className="contact-head">Contact Us</p>
  </div>
)

export default Contacts
