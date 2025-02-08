import styles from './HomePage.module.css'

const HomePage = function(...props){
    return (
        <div className={styles.UnityFrame}>
            <iframe overflow='hidden' title=' ' width='100%' height='100%' src={'https://bgitu-sec.vercel.app/?token=' + localStorage.getItem('TOKEN')}></iframe>
        </div>
    )
}

export default HomePage