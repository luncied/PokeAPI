// import axios from 'axios';
import { api, resultCont } from '../js/var.js';
import capitalize from '../helpers/capitalize.js';
import clearHTML from '../helpers/clearHTML.js'

export { searchPokemon, getOptData, loadPokemons, nextPage }


// Optiene los datos del pokemon buscado (parametro endpoint que recibe alguna consulta de la api)
async function getData(endpoint = "pokemon/?offset=0&limit=20", pokeapi = true){
    try{
        if (pokeapi){
            const response = await fetch(api + endpoint );
            const result = await response.json()
            return result
        };
        const response = await fetch(endpoint );
        const result = await response.json()
        return result
    } catch {
        console.error("Error al obtener los datos de la api")
    }

};

// Obtiene los datos para generar las opciones en los selects
async function getOptData(select, endpoint) {
    const selectCont = select ; // elemento del contenedor formulario

    const response = await fetch(api + endpoint);
    const result = await response.json();
    const optArray = result.results;
    addOptions(optArray, selectCont);
};

// Funcion para cargar las tarjetas 
async function loadCards(pokeArray = []){
    // Iteramos sobre los datos del json
    for(let pokemon of pokeArray.results){
        const info = await getData(pokemon.url, false);
        createSingleCard(info)
    }
};

// Función que crea una sola tarjeta de personaje
function createSingleCard(data = {}){
    const name = data.name;
    const id = data.id;
    const height = data.height;
    const imgDef = data.sprites.other['official-artwork'].front_default;
    const imgShiny = data.sprites.other['official-artwork'].front_shiny;
    const types = data.types;
    const weight = data.weight;

    const charContainer = document.createElement('div');
    charContainer.classList.add('col', 'mt-3');

    const charCard = document.createElement('div');
    charCard.classList.add('card'); 
    charCard.style = "width: 15rem;"

    const charImg = document.createElement('img');
    charImg.classList.add('card-img-top');
    charImg.alt = `${name}_img`;
    charImg.src = imgDef;

    const charCardBody = document.createElement('div'); 
    charCardBody.classList.add('card-body');

    const charID = document.createElement('p');
    charID.classList.add('card-subtitle','text-secondary-emphasis', 'ts-1', 'pt-3');
    charID.textContent = `ID N.° ${id}`;

    const charHeading = document.createElement('h4');
    charHeading.classList.add('card-title', 'p-2');
    charHeading.textContent = capitalize(name);
    
    const charTypes = document.createElement('div');
    charTypes.classList.add('d-inline', 'input-group', 'justify-content-start', 'py-5');
    // types.forEach(type => console.log(type))
    for(let obj of types){
        const contTypes = document.createElement('span');
        const pokeType = document.createElement('img');
        const typeName = obj.type.name;
        contTypes.classList.add('icon', `${typeName}`, 'badge', 'rounded-pill', 'mx-3');
        contTypes.style.width = '22%';
        contTypes.style.height = '12%';
        // contTypes.textContent = capitalize(typeName);
        pokeType.classList.add('img-fluid');
        pokeType.src = `./assets/img/types/${typeName}.svg`;
        pokeType.alt = `${typeName}_img`;
        contTypes.appendChild(pokeType);
        charTypes.appendChild(contTypes);
    }
    // ordenar html

    charCardBody.appendChild(charID);
    charCardBody.appendChild(charHeading);
    charCardBody.appendChild(charTypes);

    // charCard.appendChild(charImg);
    charCard.appendChild(charCardBody);

    charContainer.appendChild(charCard);

    resultCont.appendChild(charContainer);
};

// Consulta el endpoint de la api y carga las tarjetas de los pokemones. Regresa la consulta a la api
async function loadPokemons(endpoint){
    let pokemons;
    try{
        if(endpoint){
            pokemons = await getData(endpoint, pokeapi = false);
            loadCards(pokemons);
        } else{
            pokemons = await getData();
            loadCards(pokemons);
        }
    } catch {
        console.log("No es posible cargar la pagina, contacte a soporte")
    }

    return pokemons;
}

// Obtiene los datos del pokemon buscado en la sección de Nombre del Pokemon
async function searchPokemon(inputValue) {
    const selector = resultCont;
    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);

    let pokemon;
    let pokemonData ;

    if(!inputValue){
        pokemonData = await getData();
    } else{
        pokemon = inputValue;
        pokemonData = getData(`pokemon/${pokemon}`);
    }

    try{
        loadCards(pokemonData);

    } catch{
        console.error('Error al cargar la base de datos. Consulte al desarrollador para mas información');
    }

    return pokemonData;
}

// Añade las opciones a los selectores de Tipo y de Generación
function addOptions(optArray = [], selector) {
    /*
        selector : Contenedor del formulario
    */
    for(let element of optArray){
        const option = document.createElement('option');
        option.value = element.name;
        option.textContent = capitalize(element.name); // Capitaliza el elemento
        selector.appendChild(option);
    };
};

async function nextPage(consult){
    const currentPage = consult;
    const nextPage = currentPage.next;
    return nextPage;
};


// async function loadPokemons(currentPage){

//     try {
//         const pokemonData = await getData(next, false)
//         loadCards(pokemonData)
//     }catch{
//         console.error("error al cargar las tarjetas de información")
//     }

// };



// To sort an object by a value or key
// const maxSpeed = {
//     car: 300, 
//     bike: 60, 
//     motorbike: 200, 
//     airplane: 1000,
//     helicopter: 400, 
//     rocket: 8 * 60 * 60
// };

// const sortable = Object.fromEntries(
//     Object.entries(maxSpeed).sort(([,a],[,b]) => a-b)
// );

// console.log(sortable);
