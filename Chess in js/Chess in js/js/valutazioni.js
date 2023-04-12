var AperturaFilaTorre = 10;
var AperturaSemiFilaTorre = 5;
var AperturaFilaRegina = 5;
var AperturaSemiFilaRegina = 3;
var AlfierePair = 30;

var ColonneBianchedelPedone = new Array(10);
var ColonneNeredelPedone = new Array(10);

var PedoneSolosoletto = -10;
var PedonecheèriuscitoaPassare = [ 0, 5, 10, 20, 35, 60, 100, 200 ]; 

var MappaPedone = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var MappaCavallo = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

var MappaAlfiere = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var MappaTorre = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

var ReE = [	
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	,
	-10,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
	0	,	10	,	20	,	20	,	20	,	20	,	10	,	0	,
	0	,	10	,	20	,	40	,	40	,	20	,	10	,	0	,
	0	,	10	,	20	,	40	,	40	,	20	,	10	,	0	,
	0	,	10	,	20	,	20	,	20	,	20	,	10	,	0	,
	-10,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	
];

var ReO = [	
	0	,	5	,	5	,	-10	,	-10	,	0	,	10	,	5	,
	-30	,	-30	,	-30	,	-30	,	-30	,	-30	,	-30	,	-30	,
	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70		
];

function MD() {
    if (0 == sch_pdnNum[PEDINE.wR] && 0 == sch_pdnNum[PEDINE.bR] && 0 == sch_pdnNum[PEDINE.wQ] && 0 == sch_pdnNum[PEDINE.bQ]) {
	  if (0 == sch_pdnNum[PEDINE.bB] && 0 == sch_pdnNum[PEDINE.wB]) {
	      if (sch_pdnNum[PEDINE.wN] < 3 && sch_pdnNum[PEDINE.bN] < 3) {  return BOOL.TRUE; }
	  } else if (0 == sch_pdnNum[PEDINE.wN] && 0 == sch_pdnNum[PEDINE.bN]) {
	     if (Math.abs(sch_pdnNum[PEDINE.wB] - sch_pdnNum[PEDINE.bB]) < 2) { return BOOL.TRUE; }
	  } else if ((sch_pdnNum[PEDINE.wN] < 3 && 0 == sch_pdnNum[PEDINE.wB]) || (sch_pdnNum[PEDINE.wB] == 1 && 0 == sch_pdnNum[PEDINE.wN])) {
	    if ((sch_pdnNum[PEDINE.bN] < 3 && 0 == sch_pdnNum[PEDINE.bB]) || (sch_pdnNum[PEDINE.bB] == 1 && 0 == sch_pdnNum[PEDINE.bN]))  { return BOOL.TRUE; }
	  }
	} else if (0 == sch_pdnNum[PEDINE.wQ] && 0 == sch_pdnNum[PEDINE.bQ]) {
        if (sch_pdnNum[PEDINE.wR] == 1 && sch_pdnNum[PEDINE.bR] == 1) {
            if ((sch_pdnNum[PEDINE.wN] + sch_pdnNum[PEDINE.wB]) < 2 && (sch_pdnNum[PEDINE.bN] + sch_pdnNum[PEDINE.bB]) < 2)	{ return BOOL.TRUE; }
        } else if (sch_pdnNum[PEDINE.wR] == 1 && 0 == sch_pdnNum[PEDINE.bR]) {
            if ((sch_pdnNum[PEDINE.wN] + sch_pdnNum[PEDINE.wB] == 0) && (((sch_pdnNum[PEDINE.bN] + sch_pdnNum[PEDINE.bB]) == 1) || ((sch_pdnNum[PEDINE.bN] + sch_pdnNum[PEDINE.bB]) == 2))) { return BOOL.TRUE; }
        } else if (sch_pdnNum[PEDINE.bR] == 1 && 0 == sch_pdnNum[PEDINE.wR]) {
            if ((sch_pdnNum[PEDINE.bN] + sch_pdnNum[PEDINE.bB] == 0) && (((sch_pdnNum[PEDINE.wN] + sch_pdnNum[PEDINE.wB]) == 1) || ((sch_pdnNum[PEDINE.wN] + sch_pdnNum[PEDINE.wB]) == 2))) { return BOOL.TRUE; }
        }
    }
  return BOOL.FALSE;
  
}

var HAIFINITOILGIOCO = 1 * PedinaVal[PEDINE.wR] + 2 * PedinaVal[PEDINE.wN] + 2 * PedinaVal[PEDINE.wP] + PedinaVal[PEDINE.wK];

function PedoneInit() {
	var index = 0;
	
	for(index = 0; index < 10; ++index) {				
		ColonneBianchedelPedone[index] = COLONNE.COLONNA_8;			
		ColonneNeredelPedone[index] = COLONNE.COLONNA_1;
	}
	
	pdn = PEDINE.wP;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		if(ColonneSch[quad] < ColonneBianchedelPedone[FileSch[quad]+1]) {
			ColonneBianchedelPedone[FileSch[quad]+1] = ColonneSch[quad];
		}
	}	

	pdn = PEDINE.bP;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		if(ColonneSch[quad] > ColonneNeredelPedone[FileSch[quad]+1]) {
			ColonneNeredelPedone[FileSch[quad]+1] = ColonneSch[quad];
		}			
	}	
}

function EP() {

	var pdn;
	var pdnNum;
	var quad;
	var punti = sch_mater[COLORI.WHITE] - sch_mater[COLORI.BLACK];
	var fila;
	var colonna;
	if(0 == sch_pdnNum[PEDINE.wP] && 0 == sch_pdnNum[PEDINE.bP] && MD() == BOOL.TRUE) {
		return 0;
	}
	
	PedoneInit();
	
	pdn = PEDINE.wP;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti += MappaPedone[QUAD64(quad)];	
		fila = FileSch[quad]+1;
		colonna = ColonneSch[quad];
		if(ColonneBianchedelPedone[fila-1]==COLONNE.COLONNA_8 && ColonneBianchedelPedone[fila+1]==COLONNE.COLONNA_8) {
			punti += PedoneSolosoletto;
		}
		
		if(ColonneNeredelPedone[fila-1]<=colonna && ColonneNeredelPedone[fila]<=colonna && ColonneNeredelPedone[fila+1]<=colonna) {
			punti += PedonecheèriuscitoaPassare[colonna];
		}
	}	

	pdn = PEDINE.bP;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti -= MappaPedone[RIFLESSO64(QUAD64(quad))];	
		fila = FileSch[quad]+1;
		colonna = ColonneSch[quad];
		if(ColonneNeredelPedone[fila-1]==COLONNE.COLONNA_1 && ColonneNeredelPedone[fila+1]==COLONNE.COLONNA_1) {
			punti -= PedoneSolosoletto;
		}	
		
		if(ColonneBianchedelPedone[fila-1]>=colonna && ColonneBianchedelPedone[fila]>=colonna && ColonneBianchedelPedone[fila+1]>=colonna) {
			punti -= PedonecheèriuscitoaPassare[7-colonna];
		}	
	}	
	
	pdn = PEDINE.wN;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti += MappaCavallo[QUAD64(quad)];
	}	

	pdn = PEDINE.bN;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti -= MappaCavallo[RIFLESSO64(QUAD64(quad))];
	}			
	
	pdn = PEDINE.wB;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti += MappaAlfiere[QUAD64(quad)];
	}	

	pdn = PEDINE.bB;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti -= MappaAlfiere[RIFLESSO64(QUAD64(quad))];
	}	

	pdn = PEDINE.wR;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti += MappaTorre[QUAD64(quad)];	
		fila = FileSch[quad]+1;
		if(ColonneBianchedelPedone[fila]==COLONNE.COLONNA_8) {
			if(ColonneNeredelPedone[fila]==COLONNE.COLONNA_1) {
				punti += AperturaFilaTorre;
			} else  {
				punti += AperturaSemiFilaTorre;
			}
		}
	}	

	pdn = PEDINE.bR;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti -= MappaTorre[RIFLESSO64(QUAD64(quad))];	
		fila = FileSch[quad]+1;
		if(ColonneNeredelPedone[fila]==COLONNE.COLONNA_1) {
			if(ColonneBianchedelPedone[fila]==COLONNE.COLONNA_8) {
				punti -= AperturaFilaTorre;
			} else  {
				punti -= AperturaSemiFilaTorre;
			}
		}
	}
	
	pdn = PEDINE.wQ;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti += MappaTorre[QUAD64(quad)];	
		fila = FileSch[quad]+1;
		if(ColonneBianchedelPedone[fila]==COLONNE.COLONNA_8) {
			if(ColonneNeredelPedone[fila]==COLONNE.COLONNA_1) {
				punti += AperturaFilaRegina;
			} else  {
				punti += AperturaSemiFilaRegina;
			}
		}
	}	

	pdn = PEDINE.bQ;	
	for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
		quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
		punti -= MappaTorre[RIFLESSO64(QUAD64(quad))];	
		fila = FileSch[quad]+1;
		if(ColonneNeredelPedone[fila]==COLONNE.COLONNA_1) {
			if(ColonneBianchedelPedone[fila]==COLONNE.COLONNA_8) {
				punti -= AperturaFilaRegina;
			} else  {
				punti -= AperturaSemiFilaRegina;
			}
		}
	}	
	
	pdn = PEDINE.wK;
	quad = sch_pLista[PDNINDEX(pdn,0)];
	
	if( (sch_mater[COLORI.BLACK] <= HAIFINITOILGIOCO) ) {
		punti += ReE[QUAD64(quad)];
	} else {
		punti += ReO[QUAD64(quad)];
	}
	
	pdn = PEDINE.bK;
	quad = sch_pLista[PDNINDEX(pdn,0)];
	
	if( (sch_mater[COLORI.WHITE] <= HAIFINITOILGIOCO) ) {
		punti -= ReE[RIFLESSO64(QUAD64(quad))];
	} else {
		punti -= ReO[RIFLESSO64(QUAD64(quad))];
	}
	
	if(sch_pdnNum[PEDINE.wB] >= 2) punti += AlfierePair;
	if(sch_pdnNum[PEDINE.bB] >= 2) punti -= AlfierePair;
	
	if(sch_lato == COLORI.WHITE) {
		return punti;
	} else {
		return -punti;
	}	
}