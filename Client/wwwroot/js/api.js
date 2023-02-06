// Starwars API
function homeworld(url) {
    let name = "";
    $.ajax({
        url: url,
        async: false
    }).done((result) => {
        name = result.name;
    });
    return name;
}

$.ajax({
    url: "https://swapi.dev/api/people/",
    beforeSend: function () {
        $('#loadingsw').show();
    }
}).done((result) => {
    let peoples = "";
    $.each(result.results, function (key, val) {
        peoples += `<tr>
                        <td class="text-center">${key + 1}</td>
                        <td>${val.name}</td>
                        <td class="text-center">${val.height} cm</td>
                        <td class="text-center">${val.birth_year}</td>
                        <td class="text-center">${val.gender}</td>
                        <td>${homeworld(val.homeworld)}</td>
                   </tr>`;
    })
    $("#swapi").html(peoples);
    $('#loadingsw').hide();
}).fail(err => {
    console.log(err);
});

// Yu-Gi-Oh! API
$.ajax({
    url: "https://db.ygoprodeck.com/api/v7/cardinfo.php",
    beforeSend: function () {
        $('#loadingygo').show();
    }
}).done((result) => {
    let cards = "";
    $.each(result.data, function (key, val) {
        image = val.card_images;
        cards += `<tr>
                        <td class="text-center" style="wdith: 10%;">${key + 1}</td>
                        <td><img src="${val.card_images[0].image_url_small}" alt="" /></td>
                        <td>
                            <b>Name : </b>${val.name}<br>
                            <b>Type : </b>${val.type}<br>
                            <b>Description : </b>${val.desc}<br>
                        </td>
                   </tr>`;
        if (key > 10) {
            return false;
        }
    })

    $("#ygoapi").html(cards);
    $('#loadingygo').hide();
}).fail(err => {
    console.log(err);
});

//Pokemon API
$.ajax({
    url: "https://pokeapi.co/api/v2/pokemon/",
    beforeSend: function () {
        $('#loadingpoke').show();
    }
}).done((result) => {
    let cards = "";
    $.each(result.results, function (key, val) {
        image = val.card_images;
        cards += `<tr>
                        <td class="text-center" style="wdith: 10%;">${key + 1}</td>
                        <td>${val.name}</td>
                        <td><button class="btn btn-primary" data-toggle="modal" data-target="#modalPoke" onclick="showPoke('${val.url}')">Detail</button></td>
                   </tr>`;
    })

    $("#pokedex").html(cards);
    $('#loadingpoke').hide();
}).fail(err => {
    console.log(err);
});

function showPoke(url) {
    $.ajax({
        url: url,
        beforeSend: function () {
            $('#loadingPokeModal').show();
        }
    }).done((result) => {
        let img = result.sprites.other["official-artwork"].front_default;
        let name = result.name;
        let height = result.height;
        let weight = result.weight;
        let encounters = result.location_area_encounters;
        let abilities = [];
        let moves = [];
        let stats = [];
        let types = [];
        let evolutions = [];
        let endUrl = url.substr(url.length - 4);
        endUrl = endUrl.replace('n/', '');
        endUrl = endUrl.replace('/', '');
        let startUrl = "https://pokeapi.co/api/v2/pokemon/";

        if (parseInt(endUrl) % 3 === 0) {
            evolutions.push((startUrl + (parseInt(endUrl) - 2)), (startUrl + (parseInt(endUrl) - 1)), url);
        } else if (parseInt(endUrl) % 2 === 0) {
            evolutions.push((startUrl + (parseInt(endUrl) - 1)), url, (startUrl + (parseInt(endUrl) + 1)));
        } else if (parseInt(endUrl) % 1 === 0) {
            evolutions.push(url, (startUrl + (parseInt(endUrl) + 1)), (startUrl + (parseInt(endUrl) + 2)));
        }

        $.each(result.abilities, function (key, val) {
            abilities.push({ name: val.ability.name, is_hidden: val.is_hidden });
        })

        $.each(result.moves, function (key, val) {
            moves.push(val.move.url);

            if (key > 3) {
                return false;
            }
        })

        $.each(result.stats, function (key, val) {
            stats.push({ name: val.stat.name, base_stat: val.base_stat });

            if (key > 1) {
                return false;
            }
        })

        $.each(result.types, function (key, val) {
            types.push(val.type.name);
        })

        console.log(evolutions);
        console.log(endUrl);

        document.getElementById("modalTitle").innerHTML = name;
        document.getElementById("heightPoke").innerHTML = height + "mm";
        document.getElementById("weightPoke").innerHTML = weight + "g";
        pokeImg(img);
        pokeEvo(evolutions);
        pokeTypes(types);
        pokeAbilities(abilities);
        pokeMoves(moves);
        statsPoke(stats);
        pokeEncounters(encounters);
        $('#loadingPokeModal').hide();
    }).fail(err => {
        console.log(err);
    });
}

function pokeEvo(evo) {
    let poke1 = "";
    let poke2 = "";
    let poke3 = "";

    for (var i = 0; i < evo.length; i++) {
        $.ajax({
            url: evo[i],
            async: false
        }).done((val) => {
            if (i == 0) {
                poke1 = `<img class="img-thumbnail" src="${val.sprites.front_default}" alt="" />
                         <p class="m-0">${val.name}</p>`;
            } else if (i == 1) {
                poke2 = `<img class="img-thumbnail" src="${val.sprites.front_default}" alt="" />
                         <p class="m-0">${val.name}</p>`;
            } else if (i == 2) {
                poke3 = `<img class="img-thumbnail" src="${val.sprites.front_default}" alt="" />
                         <p class="m-0">${val.name}</p>`;
            }

        })
    }
    $("#evoPoke1").html(poke1);
    $("#evoPoke2").html(poke2);
    $("#evoPoke3").html(poke3);

}

function statsPoke(stats) {
    let text = "";
    let bar = "";
    for (var i = 0; i < stats.length; i++) {
        if (stats[i].name == "hp") {
            bar += `<div class="progress" style="height: 18px; margin:5px 0;">
                          <div class="progress-bar bg-success" role="progressbar" style="width: ${stats[i].base_stat}%;" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                     </div>`;
        } else if (stats[i].name == "attack") {
            bar += `<div class="progress" style="height: 18px; margin: 5px 0;">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${stats[i].base_stat}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>`;
        } else {
            bar += `<div class="progress" style="height: 18px; margin: 5px 0;">
                         <div class="progress-bar bg-primary" role="progressbar" style="width: ${stats[i].base_stat}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                     </div>`;
        }

        text += `<p class="m-0">${stats[i].base_stat}</p>`;
    }

    $("#progressPoke").html(bar);
    $("#statPoke").html(text);
}

function pokeMoves(moves) {
    let navText = "";
    let text = "";

    for (var i = 0; i < moves.length; i++) {
        $.ajax({
            url: moves[i],
            async: false
        }).done((val) => {
            navText += `<li class="nav-item">
                            <a class="nav-link" role="tab" data-toggle="tab" href="#${val.name}">${val.name}</a>
                        </li>`;

            text += `<div class="tab-pane mx-4 mt-2" role="tabpanel" id="${val.name}">
                        <div class="row">
                        <div class="col">
                            <div class="row align-items-center">
                                <p class="mb-0 mr-2">Type</p>
                                <h6 class="m-0">${val.type.name}</h6>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row align-items-center">
                                <p class="mb-0 mr-2">Target</p>
                                <h6 class="m-0">${val.target.name}</h6>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="row align-items-center">
                                <p class="mb-0 mr-2">Power</p>
                                <h6 class="m-0">${val.power}</h6>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="row align-items-center">
                                <p class="mb-0 mr-2">PP</p>
                                <h6 class="m-0">${val.pp}</h6>
                            </div>
                        </div>
                        </div>

                        <div class="row mt-2">
                            <p class="col-1">Effect</p>
                            <h6 class="col">${val.effect_entries[0].effect}</h6>
                        </div>
                    </div>`;
        })


    }

    $("#movesTabPoke").html(navText);
    $("#movesContentPoke").html(text);
}

function pokeEncounters(encounters) {
    $.ajax({
        url: encounters,
        async: false
    }).done((result) => {
        let li = "";
        $.each(result, function (key, val) {
            li += `<li>${val.location_area.name}</li>`

            if (key > 1) {
                return false;
            }
        })

        $("#encPoke").html(li);
    })
}

function pokeAbilities(abilities) {
    let text = "";
    $.each(abilities, function (key, val) {
        let is_hidden = "Normal";

        if (val.is_hidden) {
            is_hidden = "Hidden";
        }

        text += `<div class="col">
                      <p class="m-0">${is_hidden}</p>
                      <h6>${val.name}</h6>
                 </div>`;
    })

    $("#abiPoke").html(text);
}


function pokeTypes(types) {
    let badges = "";
    $.each(types, function (key, val) {
        badges += `<span class="badge badge-pill p-2 mr-2" style="${colorBadge(val)} color:white;">${val}</span>`;
    })

    $("#typesPoke").html(badges);
}

function pokeImg(img) {
    let result = `<img class="img-thumbnail" src="${img}" alt="" />`;
    $("#imgPoke").html(result);
}

function colorBadge(type) {
    if (type == "grass" || type == "dragon" || type == "bug") {
        return "background-color:#5DBA52;"
    } else if (type == "water" || type == "ice" || type == "flying") {
        return "background-color:#36B1E0;"
    } else if (type == "fire" || type == "electric" || type == "fairy") {
        return "background-color:#F38E34;"
    } else if (type == "ground" || type == "rock" || type == "steel") {
        return "background-color:#B56B3A;"
    } else if (type == "poison" || type == "dark") {
        return "background-color:#C04698;"
    } else {
        return "background-color:#5B4A3A;"
    }
}

