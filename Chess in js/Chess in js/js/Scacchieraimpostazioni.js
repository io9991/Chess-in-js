//in questo script verrà inizializzata la disposizione della scacchiera//
var sch_lato = COLORI.WHITE;
var sch_pedine = new Array(SCH_QUAD_NUM);
var sch_enPas = QUADRATI.NO_SQ;
var sch_cinquantaMosse;	
var sch_mezzo;
var sch_intero;	
var sch_castlePerm;	
var sch_posChiave;	
var sch_pdnNum = new Array(13);
var sch_mater = new Array(2);	
var sch_pLista = new Array(14 * 10);	
var sch_storico = [];
var sch_bookLines = [];
var sch_ListadelleMosse = new Array(PROMAX * POSIZIONIMAX);
var sch_Puntimosse = new Array(PROMAX * POSIZIONIMAX);
var sch_ListadelleMosseInizio = new Array(PROMAX);
var brd_PvTable = [];	
var brd_PvArray = new Array(PROMAX);
var sch_ricercaStorico = new Array(14 * SCH_QUAD_NUM);
var sch_ricercaKiller = new Array(3 * PROMAX);

     

function DisposizionedellaScacchiera() {
	var dispStr = '';
	var colonna,fila,quad,pedina;
	var Cvuoto = 0;
	
	for(colonna = COLONNE.COLONNA_8; colonna >= COLONNE.COLONNA_1; colonna--) {
		Cvuoto = 0; 
		for(fila = FILE.FILA_A; fila <= FILE.FILA_H; fila++) {
			quad = FR2SQ(fila,colonna);
			pedina = sch_pedine[quad];
			if(pedina == PEDINE.EMPTY) {
				Cvuoto++;
			} else {
				if(Cvuoto!=0) {
					dispStr += String.fromCharCode('0'.charCodeAt() + Cvuoto);
				}
				Cvuoto = 0;
				dispStr += PdnChar[pedina];
			}
		}
		if(Cvuoto!=0) {
			dispStr += String.fromCharCode('0'.charCodeAt() + Cvuoto);
		}
		
		if(colonna!=COLONNE.COLONNA_1) {
			dispStr += '/'
		} else {
			dispStr += ' ';
		}
	}
	
	dispStr += LatoChar[sch_lato] + ' ';
	if(sch_enPas == QUADRATI.NO_SQ) {
		dispStr += '- '
	} else {
		dispStr += PrSq(sch_enPas) + ' ';
	}
	
	if(sch_castlePerm == 0) {
		dispStr += '- '
	} else {
		if(sch_castlePerm & CASTLEBIT.WKCA) dispStr += 'K';
		if(sch_castlePerm & CASTLEBIT.WQCA) dispStr += 'Q';
		if(sch_castlePerm & CASTLEBIT.BKCA) dispStr += 'k';
		if(sch_castlePerm & CASTLEBIT.BQCA) dispStr += 'q';
	}
	dispStr += ' ';
	dispStr += sch_cinquantaMosse;
	dispStr += ' ';
	var tHM = sch_intero;
	if(sch_lato == COLORI.BLACK) {
		tHM--;
	}
	dispStr += tHM/2;	
	
	return dispStr;
}

function ControllaScacchiera() {   
 
	var t_pdnNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_mater = [ 0, 0];
	
	var quad64,t_pedina,t_pdn_num,quad120,colore,pc;
	

	for(t_pedina = PEDINE.wP; t_pedina <= PEDINE.bK; ++t_pedina) {
		for(t_pdn_num = 0; t_pdn_num < sch_pdnNum[t_pedina]; ++t_pdn_num) {
			quad120 = sch_pLista[PDNINDEX(t_pedina,t_pdn_num)];
			if(sch_pedine[quad120]!=t_pedina) {
				console.log('Error Pce Lists');
				return BOOL.FALSE;
				
			}
		}	
	}
	

	for(quad64 = 0; quad64 < 64; ++quad64) {
		quad120 = QUAD120(quad64);
		t_pedina = sch_pedine[quad120];
		t_pdnNum[t_pedina]++;
		t_mater[PedinaCol[t_pedina]] += PedinaVal[t_pedina];
	}
	
	for(t_pedina = PEDINE.wP; t_pedina <= PEDINE.bK; ++t_pedina) {
		if(t_pdnNum[t_pedina]!=sch_pdnNum[t_pedina]) {
				console.log('Error t_pdnNum');
				return BOOL.FALSE;
			}	
	}
	
	if(t_mater[COLORI.WHITE]!=sch_mater[COLORI.WHITE] || t_mater[COLORI.BLACK]!=sch_mater[COLORI.BLACK]) {
				console.log('Error t_mater');
				return BOOL.FALSE;
			}		
	if(sch_lato!=COLORI.WHITE && sch_lato!=COLORI.BLACK) {
				console.log('Error sch_lato');
				return BOOL.FALSE;
			}
	if(GeneralaPosizionechiave()!=sch_posChiave) {
				console.log('Error sch_posChiave');
				return BOOL.FALSE;
			}
	
	 
	return BOOL.TRUE;	
}

function vediamolalineadigioco() {

	var MossaNum = 0;
	var Lineadigioco = "";
	for(MossaNum = 0; MossaNum < sch_intero; ++MossaNum) {
		Lineadigioco += PrMove(sch_storico[MossaNum].mossa) + " ";
	}
	
	return $.trim(Lineadigioco);
	
}

function LM(BookLine,gamelinea) {

	for(var len = 0; len < gamelinea.length; ++len) {
		
		if(len>=BookLine.length) {  return BOOL.FALSE;	}	
		if(gamelinea[len] != BookLine[len]) { return BOOL.FALSE;	}	
	}
	
	return BOOL.TRUE;
}

function BM() {

	var Lineadigioco = vediamolalineadigioco();
	var mossebook = [];
	
	var lOLH = Lineadigioco.length;
	
	if(Lineadigioco.length == 0) lOLH--;
	
	for(var bookLineNum = 0; bookLineNum <sch_bookLines.length; ++bookLineNum) {
		
		if(LM(sch_bookLines[bookLineNum],Lineadigioco) == BOOL.TRUE) {
			var mossa = sch_bookLines[bookLineNum].substr(lOLH + 1, 4);
			
			if(mossa.length==4) {
				var from = QuadFromAlg(mossa.substr(0,2));
				var to = QuadFromAlg(mossa.substr(2,2));
				
				varInternalMove = AnalisidelleMosse(from,to);
				
				mossebook.push(varInternalMove);
			} 
		}
		  
	}
	
	console.log("Total + " + mossebook.length + " mossas in array");
	
	if(mossebook.length==0) return NONTIMUOVERE;

	var num = Math.floor(Math.random()*mossebook.length);
	
	return mossebook[num];
}

function Vediamolalistadellepedine() {
	var pedina,pdnNum;
	
	for(pedina=PEDINE.wP; pedina <= PEDINE.bK; ++pedina) {
		for(pdnNum = 0; pdnNum < sch_pdnNum[pedina]; ++pdnNum) {
			console.log("Piece " + PdnChar[pedina] + " on " + PrSq(sch_pLista[PDNINDEX(pedina,pdnNum)]));
		}
	}

}

function ULsM() {	
	
	var pedina,quad,index,colore;
	
	for(index = 0; index < SCH_QUAD_NUM; ++index) {
		quad = index;
		pedina = sch_pedine[index];
		if(pedina != PEDINE.OFFBOARD && pedina != PEDINE.EMPTY) {
			colore = PedinaCol[pedina];		
			
			sch_mater[colore] += PedinaVal[pedina];
			
			sch_pLista[PDNINDEX(pedina,sch_pdnNum[pedina])] = quad;
			sch_pdnNum[pedina]++;			
		}
	}
}

function GeneralaPosizionechiave() {

	var quad = 0;
	var finalKey = 0;
	var pedina = PEDINE.EMPTY;
	
	
	for(quad = 0; quad < SCH_QUAD_NUM; ++quad) {
		pedina = sch_pedine[quad];
		if(pedina != PEDINE.EMPTY && pedina != QUADRATI.OFFBOARD) {			
			finalKey ^= PedinaChiave[(pedina * 120) + quad];
		}		
	}
	
	if(sch_lato == COLORI.WHITE) {
		finalKey ^= LatoChiave;
	}
		
	if(sch_enPas != QUADRATI.NO_SQ) {		
		finalKey ^= PedinaChiave[sch_enPas];
	}
	
	finalKey ^= CastleChiave[sch_castlePerm];
	
	return finalKey;
}

function MostraScacchiera() {
	
	var quad,fila,colonna,pedina;

	console.log("\nGame Board:\n");
	
	for(colonna = COLONNE.COLONNA_8; colonna >= COLONNE.COLONNA_1; colonna--) {
		var linea =((colonna+1) + "  ");
		for(fila = FILE.FILA_A; fila <= FILE.FILA_H; fila++) {
			quad = FR2SQ(fila,colonna);
			pedina = sch_pedine[quad];
			linea += (" " + PdnChar[pedina] + " ");
		}
		console.log(linea);
	}
	
	console.log("");
	var linea = "   ";
	for(fila = FILE.FILA_A; fila <= FILE.FILA_H; fila++) {
		linea += (' ' + String.fromCharCode('a'.charCodeAt() + fila) + ' ');	
	}
	console.log(linea);
	console.log("lato:" + LatoChar[sch_lato] );
	console.log("enPas:" + sch_enPas);
	linea = "";	
	if(sch_castlePerm & CASTLEBIT.WKCA) linea += 'K';
	if(sch_castlePerm & CASTLEBIT.WQCA) linea += 'Q';
	if(sch_castlePerm & CASTLEBIT.BKCA) linea += 'k';
	if(sch_castlePerm & CASTLEBIT.BQCA) linea += 'q';
	
	console.log("castle:" + linea);
	console.log("key:" + sch_posChiave.toString(16));
	
}

function StaccaStacca() {

	var index = 0;
	
	for(index = 0; index < SCH_QUAD_NUM; ++index) {
		sch_pedine[index] = QUADRATI.OFFBOARD;
	}
	
	for(index = 0; index < 64; ++index) {
		sch_pedine[QUAD120(index)] = PEDINE.EMPTY;
	}
	
	for(index = 0; index < 14 * 120; ++index) {
		sch_pLista[index] = PEDINE.EMPTY;
	}
	
	for(index = 0; index < 2; ++index) {		
		sch_mater[index] = 0;		
	}	
	
	for(index = 0; index < 13; ++index) {
		sch_pdnNum[index] = 0;
	}
	
	sch_lato = COLORI.BOTH;
	sch_enPas = QUADRATI.NO_SQ;
	sch_cinquantaMosse = 0;	
	sch_mezzo = 0;
	sch_intero = 0;	
	sch_castlePerm = 0;	
	sch_posChiave = 0;
	sch_ListadelleMosseInizio[sch_mezzo] = 0;
	
}

function PDisposizione(fen) {
	
	var colonna = COLONNE.COLONNA_8;
    var fila = FILE.FILA_A;
    var pedina = 0;
    var c = 0;
    var i = 0; 
	var quad64 = 0; 
	var quad120 = 0;
	var fenCnt = 0;
	
	StaccaStacca();
	
	while ((colonna >= COLONNE.COLONNA_1) && fenCnt < fen.length) {
	    c = 1;
		switch (fen[fenCnt]) {
            case 'p': pedina = PEDINE.bP; break;
            case 'r': pedina = PEDINE.bR; break;
            case 'n': pedina = PEDINE.bN; break;
            case 'b': pedina = PEDINE.bB; break;
            case 'k': pedina = PEDINE.bK; break;
            case 'q': pedina = PEDINE.bQ; break;
            case 'P': pedina = PEDINE.wP; break;
            case 'R': pedina = PEDINE.wR; break;
            case 'N': pedina = PEDINE.wN; break;
            case 'B': pedina = PEDINE.wB; break;
            case 'K': pedina = PEDINE.wK; break;
            case 'Q': pedina = PEDINE.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                pedina = PEDINE.EMPTY;
                c = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;

            case '/':
            case ' ':
                colonna--;
                fila = FILE.FILA_A;
                fenCnt++;
                continue;              

            default:
                printf("FEN error \n");
                return;
        }		
		
		for (i = 0; i < c; i++) {			
            quad64 = colonna * 8 + fila;
			quad120 = QUAD120(quad64);
            if (pedina != PEDINE.EMPTY) {
				sch_pedine[quad120] = pedina;
			
            }
			fila++;
        }
		fenCnt++;
	}	
	
	sch_lato = (fen[fenCnt] == 'w') ? COLORI.WHITE : COLORI.BLACK;
	fenCnt += 2;
	
	for (i = 0; i < 4; i++) {
        if (fen[fenCnt] == ' ') {
            break;
        }		
		switch(fen[fenCnt]) {
			case 'K': sch_castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': sch_castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': sch_castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': sch_castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCnt++;
	}
	fenCnt++;	
	
	if (fen[fenCnt] != '-') {        
		fila = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		colonna = fen[fenCnt+1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + fila + " Rank:" + colonna);	
		sch_enPas = FR2SQ(fila,colonna);		
    }
    
    sch_posChiave = GeneralaPosizionechiave();
    ULsM();
}

function QuadAttaccato(quad, lato) {
	var pdn;
	var t_quad;
	var index;
	
	if(lato == COLORI.WHITE) {
		if(sch_pedine[quad-11] == PEDINE.wP || sch_pedine[quad-9] == PEDINE.wP) {
			return BOOL.TRUE;
		}
	} else {
		if(sch_pedine[quad+11] == PEDINE.bP || sch_pedine[quad+9] == PEDINE.bP) {
			return BOOL.TRUE;
		}	
	}
	
	for(index = 0; index < 8; ++index) {		
		pdn = sch_pedine[quad + KnDir[index]];
		if(pdn != QUADRATI.OFFBOARD && PedinaCavallo[pdn] == BOOL.TRUE && PedinaCol[pdn] == lato) {
			return BOOL.TRUE;
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = RkDir[index];
		t_quad = quad + dir;
		pdn = sch_pedine[t_quad];
		while(pdn != QUADRATI.OFFBOARD) {
			if(pdn != PEDINE.EMPTY) {
				if(PedinaTorreRegina[pdn] == BOOL.TRUE && PedinaCol[pdn] == lato) {
					return BOOL.TRUE;
				}
				break;
			}
			t_quad += dir;
			pdn = sch_pedine[t_quad];
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = BiDir[index];
		t_quad = quad + dir;
		pdn = sch_pedine[t_quad];
		while(pdn != QUADRATI.OFFBOARD) {
			if(pdn != PEDINE.EMPTY) {
				if(PedinaAlfiereRegina[pdn] == BOOL.TRUE && PedinaCol[pdn] == lato) {
					return BOOL.TRUE;
				}
				break;
			}
			t_quad += dir;
			pdn = sch_pedine[t_quad];
		}
	}
	
	for(index = 0; index < 8; ++index) {		
		pdn = sch_pedine[quad + KiDir[index]];
		if(pdn != QUADRATI.OFFBOARD && PedinaRe[pdn] == BOOL.TRUE && PedinaCol[pdn] == lato) {
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
}

function MostraQuadAttaccato() {
	
	var quad,fila,colonna,pedina;

	console.log("\nAttacked:\n");
	
	for(colonna = COLONNE.COLONNA_8; colonna >= COLONNE.COLONNA_1; colonna--) {
		var linea =((colonna+1) + "  ");
		for(fila = FILE.FILA_A; fila <= FILE.FILA_H; fila++) {
			quad = FR2SQ(fila,colonna);
			if(QuadAttaccato(quad, COLORI.BLACK) == BOOL.TRUE) pedina = "X";
			else pedina = "-";
			linea += (" " + pedina + " ");
		}
		console.log(linea);
	}
	
	console.log("");
}

