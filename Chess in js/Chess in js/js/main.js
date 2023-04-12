$(document).ajaxComplete(function() {
  	
  	
});

$(function() {
	init();
	$('#fenIn').val(INIZIO_DISPOSIZIONE);
	NewGame();
	newGameAjax();
	
	$.ajax("bookXml.xml", {
		cache : false,
		dataType: "xml",
		success: function (xml) {				
			xml = $(xml);
			console.log("Read success");
			xml.find('linea').each(function() {	
				var trimmed = $(this).text().trim().split("\n");
				trimmed.forEach((el) => {
					el = el.trim();
					sch_bookLines.push(el);
				});
			});
			GameController.BookLoaded = BOOL.TRUE;
			$('#LoadingBook').remove();
			console.log("Book length: " + sch_bookLines.length + " entries");
	
			for(var i = 0; i <sch_bookLines.length; ++i) {
			
			}
		}
	});
	
	
});

function ISV() {

	var index = 0;
	for(index = 0; index < MOSSEMAX; index++) {
		sch_storico.push({
			mossa : NONTIMUOVERE,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		}); 
	}
	
	for(index = 0; index < PVENTRIES; index++) {
		brd_PvTable.push({
			mossa : NONTIMUOVERE,
			posKey : 0
		}); 
	}

}

function EI() {
	var index = 0;
	
	for(index = 0; index < 10; ++index) {				
		ColonneBianchedelPedone[index] = 0;			
		ColonneNeredelPedone[index] = 0;
	}
}

function IHC() {
    var index = 0;
	
	for(index = 0; index < 13 * 120; ++index) {				
		PedinaChiave[index] = RAND_32();
	}
	
	LatoChiave = RAND_32();
	
	for(index = 0; index < 16; ++index) {
		CastleChiave[index] = RAND_32();
	}
}

function InitSq120To64() {

	var index = 0;
	var fila = FILE.FILA_A;
	var colonna = COLONNE.COLONNA_1;
	var quad = QUADRATI.A1;
	var quad64 = 0;
	for(index = 0; index < SCH_QUAD_NUM; ++index) {
		Quad120toQuad64[index] = 65;
	}
	
	for(index = 0; index < 64; ++index) {
		Quad64toQuad120[index] = 120;
	}
	
	for(colonna = COLONNE.COLONNA_1; colonna <= COLONNE.COLONNA_8; ++colonna) {
		for(fila = FILE.FILA_A; fila <= FILE.FILA_H; ++fila) {
			quad = FR2SQ(fila,colonna);
			Quad64toQuad120[quad64] = quad;
			Quad120toQuad64[quad] = quad64;
			quad64++;
		}
	}
}

function InitFilesColonneSch() {
	
	var index = 0;
	var fila = FILE.FILA_A;
	var colonna = COLONNE.COLONNA_1;
	var quad = QUADRATI.A1;
	var quad64 = 0;
	
	for(index = 0; index < SCH_QUAD_NUM; ++index) {
		FileSch[index] = QUADRATI.OFFBOARD;
		ColonneSch[index] = QUADRATI.OFFBOARD;
	}
	
	for(colonna = COLONNE.COLONNA_1; colonna <= COLONNE.COLONNA_8; ++colonna) {
		for(fila = FILE.FILA_A; fila <= FILE.FILA_H; ++fila) {
			quad = FR2SQ(fila,colonna);
			FileSch[quad] = fila;
			ColonneSch[quad] = colonna;
		}
	}
}

function init() {	
	InitFilesColonneSch();
	InitSq120To64();
	IHC();
	ISV();
	InitMvvLva();
	initBoardSquares();
	EI();
	crc_thinking = BOOL.FALSE;
}  