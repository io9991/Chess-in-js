var UserMove = {};

//mossa del computer
UserMove.from = QUADRATI.NO_SQ;
UserMove.to = QUADRATI.NO_SQ;

var RiflessoFile = [ FILE.FILA_H, FILE.FILA_G, FILE.FILA_F, FILE.FILA_E, FILE.FILA_D, FILE.FILA_C, FILE.FILA_B, FILE.FILA_A ];
var RiflessoColonne = [ COLONNE.COLONNA_8, COLONNE.COLONNA_7, COLONNE.COLONNA_6, COLONNE.COLONNA_5, COLONNE.COLONNA_4, COLONNE.COLONNA_3, COLONNE.COLONNA_2, COLONNE.COLONNA_1 ];


function RIFLESSO120(quad) {
	var fila = RiflessoFile[FileSch[quad]];
	var colonna = RiflessoColonne[ColonneSch[quad]];
	return FR2SQ(fila,colonna);
}

$("#SetFen").click(function () {
	var dispStr = $("#fenIn").val();	
	PDisposizione(dispStr);
	MostraScacchiera();		
	SetInitialBoardPieces();	
	GameController.PlayerSide = sch_lato;	
	Controllaevai();	
	EP();	

	newGameAjax();	 
});

function ControllaRisultato() {

    if (sch_cinquantaMosse > 100) {
     $("#GameStatus").text("GAME DRAWN {fifty mossa rule}"); 
     return BOOL.TRUE;
    }

    if (TFR() >= 2) {
     $("#GameStatus").text("GAME DRAWN {3-fold repetition}"); 
     return BOOL.TRUE;
    }
	
	if (Dm() == BOOL.TRUE) {
     $("#GameStatus").text("GAME DRAWN {insufficient material to mate}"); 
     return BOOL.TRUE;
    }
	
	console.log('Ricerca per la fine del gioco');
	GeneraleMosse();
      
    var MossaNum = 0;
	var trovato = 0;
	for(MossaNum = sch_ListadelleMosseInizio[sch_mezzo]; MossaNum < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++MossaNum)  {	
       
        if ( FaituaMossa(sch_ListadelleMosse[MossaNum]) == BOOL.FALSE)  {
            continue;
        }
        trovato++;
		SubisciMossa();
		break;
    }
    
    $("#currentFenSpan").text(DisposizionedellaScacchiera()); 
	
	if(trovato != 0) return BOOL.FALSE;
	var InCheck = QuadAttaccato(sch_pLista[PDNINDEX(dueRe[sch_lato],0)], sch_lato^1);
	console.log('Nessuna mossa trovata, incheck:' + InCheck);
	
	if(InCheck == BOOL.TRUE)	{
	    if(sch_lato == COLORI.WHITE) {
			
		  $("#GameStatus").text("OH NO, IL LADRO E' SCAPPATO!");return BOOL.TRUE;
        } else {
	      $("#GameStatus").text("COMPLIMENTI,HAI CATTURATO IL LADRO!");return BOOL.TRUE;
        }
    } else {
      $("#GameStatus").text("GAME DRAWN {stalemate}");return BOOL.TRUE;
    }	
  	
}
//mostra nella console le specifiche del quadrato cliccato//
function QuadratoCliccato(pageX, pageY) {
	var position = $("#Board").position();
	console.log("Pedina cliccata " + pageX + "," + pageY + " top:" + position.top + " left:" + position.left);
	
	var workedX = Math.floor(position.left);
	var workedY = Math.floor(position.top);
	var pageX = Math.floor(pageX);
	var pageY = Math.floor(pageY);
	
	var fila = Math.floor((pageX-workedX) / 60);
	var colonna = 7 - Math.floor((pageY-workedY) / 60);
	
	var quad = FR2SQ(fila,colonna);
	
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		quad = RIFLESSO120(quad);
	}
	
	console.log("WorkedX: " + workedX + " WorkedY:" + workedY + " Fila:" + fila + " Colonna:" + colonna);
	console.log("cliccato:" + PrSq(quad));	
	
	QuadratoSelezionato(quad);
	
	return quad;
	if(PrSq(quad)==a1){
		console.log
	}


}

function Controllaevai() {
	if(ControllaRisultato() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE; 
	}

	 $("#currentFenSpan").text(DisposizionedellaScacchiera());
}
//questa funzione permette di dare una risposta alla mossa dl giocatore//
function PreCerca() {
		
		if(GameController.GameOver != BOOL.TRUE) {				
			crc_thinking = BOOL.TRUE;
			setTimeout( function() {InizialaRicerca(); }, 200);
		}
}

function FailaMossa() {
	if(UserMove.from != QUADRATI.NO_SQ && UserMove.to != QUADRATI.NO_SQ) {
		console.log("Mossa del giocatore :" + PrSq(UserMove.from) + PrSq(UserMove.to));
		
		var analisi = AnalisidelleMosse(UserMove.from,UserMove.to);
		
		QuadratoDeselezionato(UserMove.from);
		QuadratoDeselezionato(UserMove.to);
		
		console.log("analisi:" + analisi);
		
		if(analisi != NONTIMUOVERE) {
			FaituaMossa(analisi);
			Muovilapedinadelcomputer(analisi);
			Controllaevai();
			PreCerca();
		}
		
		UserMove.from = QUADRATI.NO_SQ;
		UserMove.to = QUADRATI.NO_SQ; 	
	}
	if(analisi==0) {
		$("#GameStatus").text("mossa non concessa"); 
	}
}

$(document).on('click','.Piece', function (e) {	
	console.log("Piece Click");
	if(crc_thinking == BOOL.FALSE && GameController.PlayerSide == sch_lato) {
		if(UserMove.from == QUADRATI.NO_SQ) 
			UserMove.from = QuadratoCliccato(e.pageX, e.pageY);
			
		else 
			UserMove.to = QuadratoCliccato(e.pageX, e.pageY);	
	
		FailaMossa();	
	}	
});

$(document).on('click','.Square', function (e) {	
	console.log("quadrato cliccato");
	if(crc_thinking == BOOL.FALSE && GameController.PlayerSide == sch_lato && UserMove.from != QUADRATI.NO_SQ) {
		UserMove.to = QuadratoCliccato(e.pageX, e.pageY);
		FailaMossa();
		
	}
});

function Rimuovilapedinadelcomputer(quad) {
	
	$( ".Piece" ).each(function( index ) {
		
		 if( (ColonneSch[quad] == 7 - Math.round($(this).position().top/60)) && (FileSch[quad] == Math.round($(this).position().left/60)) ){		
			
			$(this).remove();	
		 }
		});
}

function Aggiungilapedinadelcomputer(quad,pdn) {	
	var colonna = ColonneSch[quad];
	var fila = FileSch[quad];
	var colonnaNome = "colonna" + (colonna + 1);	
	var filaNome = "fila" + (fila + 1);	
	pedinaFilaNome = "images/" + LatoChar[PedinaCol[pdn]] + PdnChar[pdn].toUpperCase() + ".png";
	imageString = "<image src=\"" + pedinaFilaNome + "\" class=\"Piece clickElement " + colonnaNome + " " + filaNome + "\"/>";
	
	$("#Board").append(imageString);
}

function Muovilapedinadelcomputer(mossa) {
	var from = FROMSQ(mossa);
	var to = TOSQ(mossa);
	
	var flippatoFrom = from;
	var flippatoTo = to;
	var epWhite = -10;
	var epBlack = 10;
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		flippatoFrom = RIFLESSO120(from);
		flippatoTo = RIFLESSO120(to);
		epWhite = 10;
		epBlack = -10;
	}
	


	if(mossa & MFLAGEP) {	
		var epRimosso;			
		if(sch_lato == COLORI.BLACK) {
			epRimosso = flippatoTo + epWhite;
		} else {
			epRimosso = flippatoTo + epBlack;
		}
		console.log("en pas removing from " + PrSq(epRimosso));
		Rimuovilapedinadelcomputer(epRimosso);
	} else if(CATTURATO(mossa)) {
		Rimuovilapedinadelcomputer(flippatoTo);
		console.log("rimosso:"+ PrSq(flippatoTo));
		
	}
	

	var colonna = ColonneSch[flippatoTo];
	var fila = FileSch[flippatoTo];
	var colonnaNome = "colonna" + (colonna + 1);	
	var filaNome = "fila" + (fila + 1);
	
	
	$( ".Piece" ).each(function( index ) {
     
     if( (ColonneSch[flippatoFrom] == 7 - Math.round($(this).position().top/60)) && (FileSch[flippatoFrom] == Math.round($(this).position().left/60)) ){
     	
     	$(this).removeClass();
     	$(this).addClass("Piece clickElement " + colonnaNome + " " + filaNome);     
     }
    });
    
    if(mossa & MFLAGCA) {  
    	if(GameController.BoardFlipped == BOOL.TRUE) {  	
			switch (to) {
				case QUADRATI.G1: Rimuovilapedinadelcomputer(RIFLESSO120(QUADRATI.H1));Aggiungilapedinadelcomputer(RIFLESSO120(QUADRATI.F1),PEDINE.wR); break;
				case QUADRATI.C1: Rimuovilapedinadelcomputer(RIFLESSO120(QUADRATI.A1));Aggiungilapedinadelcomputer(RIFLESSO120(QUADRATI.D1),PEDINE.wR); break;
				case QUADRATI.G8: Rimuovilapedinadelcomputer(RIFLESSO120(QUADRATI.H8));Aggiungilapedinadelcomputer(RIFLESSO120(QUADRATI.F8),PEDINE.bR); break;
				case QUADRATI.C8: Rimuovilapedinadelcomputer(RIFLESSO120(QUADRATI.A8));Aggiungilapedinadelcomputer(RIFLESSO120(QUADRATI.D8),PEDINE.bR); break;    			
			}  
		} else {
			switch (to) {
				case QUADRATI.G1: Rimuovilapedinadelcomputer(QUADRATI.H1);Aggiungilapedinadelcomputer(QUADRATI.F1,PEDINE.wR); break;
				case QUADRATI.C1: Rimuovilapedinadelcomputer(QUADRATI.A1);Aggiungilapedinadelcomputer(QUADRATI.D1,PEDINE.wR); break;
				case QUADRATI.G8: Rimuovilapedinadelcomputer(QUADRATI.H8);Aggiungilapedinadelcomputer(QUADRATI.F8,PEDINE.bR); break;
				case QUADRATI.C8: Rimuovilapedinadelcomputer(QUADRATI.A8);Aggiungilapedinadelcomputer(QUADRATI.D8,PEDINE.bR); break;    			
			}  
		}  	
    }
    var prom = PROMOTED(mossa);
    console.log("PromPce:" + prom);
    if(prom != PEDINE.EMPTY) {
		console.log("prom removing from " + PrSq(flippatoTo));
    	Rimuovilapedinadelcomputer(flippatoTo);
    	Aggiungilapedinadelcomputer(flippatoTo,prom);
    }
    
    vediamolalineadigioco();
}



function QuadratoDeselezionato(quad) {

	if(GameController.BoardFlipped == BOOL.TRUE) {
		quad = RIFLESSO120(quad);
	}
	
	$( ".Square" ).each(function( index ) {     
     if( (ColonneSch[quad] == 7 - Math.round($(this).position().top/60)) && (FileSch[quad] == Math.round($(this).position().left/60)) ){     	
     	$(this).removeClass('SqSelected');    
     }
    });
}

function QuadratoSelezionato(quad) {
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		quad = RIFLESSO120(quad);
	}
	
	$( ".Square" ).each(function( index ) {    
	
     if( (ColonneSch[quad] == 7 - Math.round($(this).position().top/60)) && (FileSch[quad] == Math.round($(this).position().left/60)) ){   
		
     	$(this).addClass('SqSelected');    
     }
    });
}

function InizialaRicerca() {
	crc_depth = PROMAX;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("tempo:" + t + " TimeChoice:" + tt);
	crc_tempo = parseInt(tt) * 1000;
	CercaPos(); 	
	
	
	FaituaMossa(crc_migliore);
	Muovilapedinadelcomputer(crc_migliore);	

	Controllaevai();
}
//il bottone che permetterà di tornare indietro//
$("#TakeButton").click(function () {	
	console.log('TakeBack request... sch_intero:' + sch_intero);
	if(sch_intero > 0) {
		SubisciMossa();
		sch_mezzo = 0;
		SetInitialBoardPieces();
		SubisciMossa();
		sch_mezzo = 0;
		SetInitialBoardPieces();
		$("#currentFenSpan").text(DisposizionedellaScacchiera());
	}
});

//bottone help//
$("#SearchButton").click(function () {	
	GameController.PlayerSide = sch_lato^1;
	PreCerca();	
	GameController.PlayerSide = sch_lato^1;
	PreCerca();	
});


function NewGame() {
	PDisposizione(INIZIO_DISPOSIZIONE);
	MostraScacchiera();		
	SetInitialBoardPieces();
	GameController.PlayerSide = sch_lato;
	Controllaevai();	
	GameController.GameSaved = BOOL.FALSE;
	$("#BestOut").text("MigliorMossa: " + 0);
	$("#OrderingOut").text("Ordering:"+0);
	$("#DepthOut").text("Depth: "+0);
	$("#PunteggioOut").text("Punteggio:"+0);
	$("#NodesOut").text("Nodes:"+0);
	$("#TimeOut").text("Time: 0s");
}

$("#NewGameButton").click(function () {	
	NewGame();
	newGameAjax();
});

$("#FlipButton").click(function () {
GameController.BoardFlipped ^= 1;
	console.log("Flipped:" + GameController.BoardFlipped);
	SetInitialBoardPieces();
})

function newGameAjax() {
	console.log('new Game Ajax');
	
}

function initBoardSquares() {

	
	var light = 0;
	var colonnaNome;
	var filaNome;
	var divString;
	var lightString;
	var lastLight=0;
	
	for(colonnaIter = COLONNE.COLONNA_8; colonnaIter >= COLONNE.COLONNA_1; colonnaIter--) {	
		light = lastLight ^ 1;
		lastLight ^= 1;
		colonnaNome = "colonna" + (colonnaIter + 1);			
		for(filaIter = FILE.FILA_A; filaIter <= FILE.FILA_H; filaIter++) {			
		    filaNome = "fila" + (filaIter + 1); 
		    if(light==0) lightString="Light";
			else lightString="Dark";
			divString = "<div class=\"Square clickElement " + colonnaNome + " " + filaNome + " " + lightString + "\"/>";
			
			light ^= 1;
			$("#Board").append(divString);
		}
	}	
}

function ClearAllPieces() {
	console.log("Removing pedine");
	$(".Piece").remove();
}

function SetInitialBoardPieces() {
	var quad;
	var quad120;
	var fila,colonna;	
	var colonnaNome;
	var filaNome;
	var imageString;
	var pedinaFilaNome;
	var pdn;
	ClearAllPieces();
	for( quad = 0; quad < 64; ++quad) {
		
		quad120 = QUAD120(quad);
		
		pdn = sch_pedine[quad120];  
		
		if(GameController.BoardFlipped == BOOL.TRUE) {
			quad120 = RIFLESSO120(quad120);
		}
		
		fila = FileSch[quad120];
		colonna = ColonneSch[quad120];
		
		
		if(pdn>=PEDINE.wP && pdn<=PEDINE.bK) {				
			colonnaNome = "colonna" + (colonna + 1);	
			filaNome = "fila" + (fila + 1);
			
			pedinaFilaNome = "images/" + LatoChar[PedinaCol[pdn]] + PdnChar[pdn].toUpperCase() + ".png";
			imageString = "<image src=\"" + pedinaFilaNome + "\" class=\"Piece " + colonnaNome + " " + filaNome + "\"/>";
		
			$("#Board").append(imageString);
		}
	}

}