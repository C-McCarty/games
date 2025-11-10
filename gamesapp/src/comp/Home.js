import GameButton from './GameButton';

export default function Home() {
    return(
        <div className=''>
            <GameButton to={"/zip"} icon={"../media/icons/zip.svg"}>Zip</GameButton>
        </div>
    );
}