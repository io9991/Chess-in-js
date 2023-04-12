function QuadFromAlg(mossaAlg) {


	if(mossaAlg.length != 2) return QUADRATI.NO_SQ;
	
	if(mossaAlg[0] > 'h' || mossaAlg[0] < 'a' ) return QUADRATI.NO_SQ;
	if(mossaAlg[1] > '8' || mossaAlg[1] < '1' ) return QUADRATI.NO_SQ;
	
	fila = mossaAlg[0].charCodeAt() - 'a'.charCodeAt();
	colonna = mossaAlg[1].charCodeAt() - '1'.charCodeAt();	
	
	return FR2SQ(fila,colonna);		
}

function Vediamolalistadellemosse() {
	var index;
	var mossa;
	console.log("lista mosse:");
	
	for(index = sch_ListadelleMosseInizio[sch_mezzo]; index < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++index) {
	
		mossa = sch_ListadelleMosse[index];	
		console.log("Move:" + (index+1) + " > " + PrMove(mossa));
		
	}
}

function PrSq(quad) {
	var fila = FileSch[quad];
	var colonna = ColonneSch[quad];
	
	var quadStr = String.fromCharCode('a'.charCodeAt() + fila) + String.fromCharCode('1'.charCodeAt() + colonna);
	return quadStr;
}

function PrMove(mossa) {

	var MvStr;
	
	var ff = FileSch[FROMSQ(mossa)];
	var rf = ColonneSch[FROMSQ(mossa)];
	var ft = FileSch[TOSQ(mossa)];
	var rt = ColonneSch[TOSQ(mossa)];
	
	MvStr = String.fromCharCode('a'.charCodeAt() + ff) + String.fromCharCode('1'.charCodeAt() + rf) + 
				String.fromCharCode('a'.charCodeAt() + ft) + String.fromCharCode('1'.charCodeAt() + rt)
				
	var promoted = PROMOTED(mossa);
	
	if(promoted != PEDINE.EMPTY) {
		var pchar = 'q';
		if(PedinaCavallo[promoted] == BOOL.TRUE) {
			pchar = 'n';
		} else if(PedinaTorreRegina[promoted] == BOOL.TRUE && PedinaAlfiereRegina[promoted] == BOOL.FALSE)  {
			pchar = 'r';
		} else if(PedinaTorreRegina[promoted] == BOOL.FALSE && PedinaAlfiereRegina[promoted] == BOOL.TRUE)   {
			pchar = 'b';
		}
		 MvStr += pchar;		
	} 	
	return MvStr;
}
//il meccanismo per generare le mosse è uguale anche per le mosse del pc//
function AnalisidelleMosse(from, to) {
	
    GeneraleMosse();     
   
	var Move = NONTIMUOVERE;
	var PromPce = PEDINE.EMPTY;
	var trovato = BOOL.FALSE;
	for(index = sch_ListadelleMosseInizio[sch_mezzo]; index < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++index) {	
		Move = sch_ListadelleMosse[index];	
		if(FROMSQ(Move)==from && TOSQ(Move)==to) {
			PromPce = PROMOTED(Move);
			if(PromPce!=PEDINE.EMPTY) {
				if( (PromPce==PEDINE.wQ && sch_lato==COLORI.WHITE) || (PromPce==PEDINE.bQ && sch_lato==COLORI.BLACK) ) {
					trovato = BOOL.TRUE;
					break;
				}
				continue;
			}
			trovato = BOOL.TRUE;
			break;
		}
    }
	
	if(trovato != BOOL.FALSE) {
		if(FaituaMossa(Move) == BOOL.FALSE) {
			
			return NONTIMUOVERE;
			
		}
	 
		SubisciMossa();
		return Move;
	}
	
	return NONTIMUOVERE;	

}