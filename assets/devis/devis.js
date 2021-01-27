
var currentNPages = 0;
var indexes = [];

function montantFormatFr(montant) {
    var ent = Math.floor(montant);
    var dec = Math.abs(montant - ent) + 0.00000001;
    if (dec < 0.01)
        dec = "0.00";
    else
        dec += " ";
    var str = ent + ',' + dec.substr(2, 2);
    return str;
}

function devisMiseEnPage(acteArray) {

    var nombreDeLigne = acteArray.length;
    var nombreDePages = Math.floor(nombreDeLigne / 6) + 1;
    if ((nombreDeLigne % 6) == 0)
        nombreDePages--;
        
    for (var i = 1; i <= nombreDePages; i++) {
        npage = nombreDePages + 1 - i;
        var typePage = '';
        if (npage == nombreDePages )
            typePage = 'devis';
        else
            typePage = 'devis-page';
        //
        if (npage > 0 && npage <= 50)
            $('.'+typePage).clone().appendTo($('#devis-print-page' + npage)).addClass('page'+(npage)).removeClass(typePage).show();
    }
    return nombreDePages;
}

function jsonToDevis(devisJSON) {
    //
    var nombreDePages = devisMiseEnPage(devisJSON.actes);
    currentNPages = nombreDePages;
    //
    //praticien
    $(".identification-praticien").each(function () {$(this).text(devisJSON.praticien.identification)});
    $(".identifiant-praticien").each(function () {$(this).text(devisJSON.praticien.identifiant)});
    $(".identification-structure").each(function () {$(this).html(devisJSON.praticien.structure)});
    $(".numero-structure").each(function () {$(this).text(devisJSON.praticien.numStructure)});

    //date et validité
    $(".date").each(function () {$(this).text(devisJSON.dates.date)});
    $('.validite').each(function () {$(this).text(devisJSON.dates.validite)});

    //patient
    $('.patient').each(function () {$(this).text(devisJSON.patient.civilite + ' ' + devisJSON.patient.nom + ' ' + devisJSON.patient.prenom)});
    $('.naissance').each(function () {$(this).text(devisJSON.patient.naissance)});
    $('.secu').each(function () {$(this).text(devisJSON.patient.secu)});

    $('.adresse-patient').each(function () {$(this).text(devisJSON.patient.adresse)});
    $('.tel-patient').each(function () {$(this).text(devisJSON.patient.telephone)});

    //description
    $('.description').each(function () {$(this).text(devisJSON.description.texteDescription)});
    if(devisJSON.description.disposition){
        $('.disposition-non-vide').show();
        $('.disposition-non-plein').hide();
        $('.disposition-oui-plein').show();
        $('.disposition-oui-vide').hide();
        $('.disposition').each(function () {$(this).text(devisJSON.description.texteDisposition)});
    }
    else {
        $('.disposition-non-plein').show();
        $('.disposition-non-vide').hide();
        $('.disposition-oui-vide').show();
        $('.disposition-oui-plein').hide();
        $('.disposition').each(function () {$(this).text("")});
    }

    //fabrication
    if(devisJSON.fabrication.lieuFabrication === "France"){

        $('.fabrication-france-plein').each(function () {$(this).show()});
        $('.fabrication-UE-vide').each(function () {$(this).show()});
        $('.fabrication-hors-UE-vide').each(function () {$(this).show()});
        $('.fabrication-france-vide').each(function () {$(this).hide()});
        $('.fabrication-UE-plein').each(function () {$(this).hide()});
        $('.fabrication-hors-UE-plein').each(function () {$(this).hide()});
        $('.fabrication-pays').each(function () {$(this).text("")});
    }
    else if (devisJSON.fabrication.lieuFabrication === "UE"){
        $('.fabrication-UE-plein').each(function () {$(this).show()});
        $('.fabrication-france-vide').each(function () {$(this).show()});
        $('.fabrication-hors-UE-vide').each(function () {$(this).show()});
        $('.fabrication-france-plein').each(function () {$(this).hide()});
        $('.fabrication-UE-vide').each(function () {$(this).hide()});
        $('.fabrication-hors-UE-plein').each(function () {$(this).hide()});
        $('.fabrication-pays').each(function () {$(this).text("")});
    }
    else {
        $('.fabrication-hors-UE-plein').each(function () {$(this).show()});
        $('.fabrication-france-vide').each(function () {$(this).show()});
        $('.fabrication-UE-vide').each(function () {$(this).show()});
        $('.fabrication-france-plein').each(function () {$(this).hide()});
        $('.fabrication-UE-plein').each(function () {$(this).hide()});
        $('.fabrication-hors-UE-vide').each(function () {$(this).hide()});
        $('.fabrication-pays').each(function () {$(this).text(devisJSON.fabrication.paysFabrication)});
    }
    //sous-traitance
    if (!devisJSON.sousTraitance.sousTraitance) {
        $('.soustraitance-sans-plein').show();
        $('.soustraitance-avec-vide').show();
        $('.soustraitance-france-vide').show();
        $('.soustraitance-UE-vide').show();
        $('.soustraitance-hors-UE-vide').show();
        $('.soustraitance-sans-vide').hide();
        $('.soustraitance-avec-plein').hide();
        $('.soustraitance-france-plein').hide();
        $('.soustraitance-UE-plein').hide();
        $('.soustraitance-hors-UE-plein').hide();
        $('.soustraitance-pays').text("");
    }
    else {
        $('.soustraitance-sans-vide').show();
        $('.soustraitance-avec-plein').show();
        $('.soustraitance-sans-plein').hide();
        $('.soustraitance-avec-vide').hide();
        $('.soustraitance-pays').text("");
        if(devisJSON.sousTraitance.lieuSousTraitance === "France") {
            $('.soustraitance-france-plein').show();
            $('.soustraitance-UE-vide').show();
            $('.soustraitance-hors-UE-vide').show();
            $('.soustraitance-france-vide').hide();
            $('.soustraitance-UE-plein').hide();
            $('.soustraitance-hors-UE-plein').hide();
            $('.soustraitance-pays').text("");
        }
        else if(devisJSON.sousTraitance.lieuSousTraitance === "UE") {
            $('.soustraitance-UE-plein').show();
            $('.soustraitance-france-vide').show();
            $('.soustraitance-hors-UE-vide').show();
            $('.soustraitance-UE-vide').hide();
            $('.soustraitance-france-plein').hide();
            $('.soustraitance-hors-UE-plein').hide();
            $('.soustraitance-pays').text("");
        }
        else {
            $('.soustraitance-hors-UE-plein').show();
            $('.soustraitance-france-vide').show();
            $('.soustraitance-UE-vide').show();
            $('.soustraitance-hors-UE-vide').hide();
            $('.soustraitance-france-plein').hide();
            $('.soustraitance-UE-plein').hide();
            $('.soustraitance-pays').text(devisJSON.sousTraitance.paysSousTraitance);
        }
    }
    //actes

    var totalA = 0.0;
    var totalB1 = 0.0;
    var totalB2 = 0.0;
    var totalC = 0.0;
    var totalD = 0.0;
    var totalE = 0.0;
    var i = 0;

    for (var k = 1; k <= nombreDePages; k++) {
        var page = k;

        var	z = (k-1)*6;
        var n = i+6;
        if (n > devisJSON.actes.length) {
            n = devisJSON.actes.length;
        }

        var j = 1;
        //for (var i = 0; i < devisJSON.actes.length; i++) {
        for ( z; z < n; z++) {

            var ligneDevis = $('.page'+page+' .ligne-simple.ligne-'+j);
            //var ligneSaisie = $('.ligne-saisie[numeroLigne='+j+']');
            //var actesIndex = 	ligneSaisie.children('.description-saisie').children('select').val();

            ligneDevis.children('.localisation').text(devisJSON.actes[i].localisation);
            var descript = devisJSON.actes[i].description.split('@')[0];// forme acte Couronne céramique@Labo Truc
            descript = (descript[0] === '+') ? descript.slice(1) : descript; // forme actes groupés (+)
            ligneDevis.children('.acte').text(descript);
            var mat = devisJSON.actes[i].materiaux;
            ligneDevis.children('.materiaux').text(mat > 0 ? mat : '-');
            ligneDevis.children('.cotation').text(devisJSON.actes[i].cotation.replace(/\s1$/, ''));
            //
            // Dès lors qu'il ne s'agit pas d'un DMSM, aucune des 3 colonnes de ventilation A B1 et B2 n'est à remplir
            //
            if (devisJSON.actes[i].A <=  0) {
                devisJSON.actes[i].A = 0;
                devisJSON.actes[i].B1 = devisJSON.actes[i].honoraire; // on reporte en B1 la totalité des honoraires
                devisJSON.actes[i].B2 = 0;
                ligneDevis.children('.A').text('-');
                ligneDevis.children('.B2').text('-');
            }
            else {
                ligneDevis.children('.A').text(montantFormatFr(devisJSON.actes[i].A));
                ligneDevis.children('.B2').text(montantFormatFr(devisJSON.actes[i].B2));
            }
            ligneDevis.children('.B1').text(montantFormatFr(devisJSON.actes[i].B1));
            ligneDevis.children('.C').text(montantFormatFr(devisJSON.actes[i].honoraire));
            ligneDevis.children('.D').text(montantFormatFr(devisJSON.actes[i].D));
            ligneDevis.children('.E').text(montantFormatFr(devisJSON.actes[i].E));

            indexes[i] = devisJSON.actes[i].index;

            totalA += devisJSON.actes[i].A;
            totalA = Math.round(totalA * 100) / 100;
            totalB1 += devisJSON.actes[i].B1;
            totalB1 = Math.round(totalB1 * 100) / 100;
            totalB2 += devisJSON.actes[i].B2;
            totalB2 = Math.round(totalB2 * 100) / 100;
            totalC += devisJSON.actes[i].honoraire;
            totalC = Math.round(totalC * 100) / 100;
            totalD += devisJSON.actes[i].D;
            totalD = Math.round(totalD * 100) / 100;
            totalE += devisJSON.actes[i].E;
            totalE = Math.round(totalE * 100) / 100;

            i++; j++;
        }

        $(".page"+page+" .ligne-simple.ligne-total").children('.A').text(montantFormatFr(totalA));
        $(".page"+page+" .ligne-simple.ligne-total").children('.B1').text(montantFormatFr(totalB1));
        $(".page"+page+" .ligne-simple.ligne-total").children('.B2').text(montantFormatFr(totalB2));
        $(".page"+page+" .ligne-simple.ligne-total").children('.C').text(montantFormatFr(totalC));
        $(".page"+page+" .ligne-simple.ligne-total").children('.D').text(montantFormatFr(totalD));
        $(".page"+page+" .ligne-simple.ligne-total").children('.E').text(montantFormatFr(totalE));
        $(".page"+page+" #totalHonoraire").text(montantFormatFr(totalC)+' €');

    }

    //	$(".ligne-simple.ligne-total").children('.A').text(totalA);
    //	$(".ligne-simple.ligne-total").children('.B1').text(totalB1);
    //	$(".ligne-simple.ligne-total").children('.B2').text(totalB2);
    //	$(".ligne-simple.ligne-total").children('.C').text(totalC);
    //	$(".ligne-simple.ligne-total").children('.D').text(totalD);
    //	$(".ligne-simple.ligne-total").children('.E').text(totalE);
    //	$('#totalHonoraire').text(totalC+' €');


}

$(document).ready(function() {
    $('#devis-print').show();
    // $('.devisPage').hide();
});


$(document.documentElement).show();


