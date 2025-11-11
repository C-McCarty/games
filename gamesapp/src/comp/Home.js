import GameButton from './GameButton';

export default function Home() {
    return(
        <div className='page-home'>
            <div className="button-grid">
                <GameButton to={"/zip"} icon={"zip"}>Zip</GameButton>
                <GameButton to={"/zip"} icon={"zip"}>Zip</GameButton>
                <GameButton to={"/zip"} icon={"zip"}>Zip</GameButton>
                <GameButton to={"/zip"} icon={"zip"}>Zip</GameButton>
            </div>
        </div>
    );
}