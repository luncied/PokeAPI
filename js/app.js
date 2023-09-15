import { searchPokemon, getOptData, loadPokemons, loadCards} from "../js/fun.js"
import { searchForm, resultCont, showMoreBtn, cards } from "../js/var.js"
import clearHTML from '../helpers/clearHTML.js';

let pokemons;
let pages;
let countPages = 1;

// Event Listener que carga los poquemones al iniciar la pagina
document.addEventListener('DOMContentLoaded', async () => {
    // getOptData(searchForm[5], 'type');
    // getOptData(searchForm[7], 'generation'); // generation ix doesn't work
    const selector = resultCont;
    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);
    pokemons = await loadPokemons();
});

// Event Listener que escucha al boton mostrar màs para mostrar màs pokemons
showMoreBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    pages = pokemons.results.length;

    try {
        if(countPages < Math.ceil(pages/30)){
            loadCards(pokemons.results.slice((countPages*30), ((countPages+1)*30)))
            countPages++
        } else {
            clearHTML(showMoreBtn.parentElement);
            console.log("ultima pagina");
        }
    } catch {
        console.error("Error al cargar el resto de tarjetas, contactar a soporte")
    }
});

searchForm.elements["poke-name"].addEventListener('keyup', () => {
    const pokemon = searchForm.elements["poke-name"].value;
    console.log(pokemon);

})

searchForm.elements["poke-id"].addEventListener('keyup', () => {
    const pokemon = searchForm.elements["poke-id"].value;
    console.log(pokemon);

})

console.log(cards)
// for(let i = 0; i < cards.length; i++){
//     console.log(cards[i])
// };


// searchForm.elements["search-btn"].addEventListener('click', (e) => {
//     e.preventDefault();
//     const pokemon = searchForm.elements["poke-name"].value;
//     pokemon ? searchPokemon(pokemon) : console.error('Ingrese un nombre de pokemon valido');
// });



