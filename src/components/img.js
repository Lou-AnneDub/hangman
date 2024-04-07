export const imgHangman = ({tries}) => {
    return (
        <img src={`./assets/img/pendu${tries}.svg`} alt={`pendu ${tries} erreurs`} />
    );
}