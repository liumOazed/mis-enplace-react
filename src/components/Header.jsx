import chef_image from '../assets/chef-icon.jpg';

export default function Header() {
    return (
        <header>
            <img src={chef_image} alt="Chef" className="chef" />
            <h1>Miz ɑ̃ plas</h1>
        </header>

    )
}