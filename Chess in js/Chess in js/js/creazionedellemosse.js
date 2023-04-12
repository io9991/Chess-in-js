function CancellaleTracc(quad) {	
	
    var pdn = sch_pedine[quad];	
	var col = PedinaCol[pdn];
	var index = 0;
	var t_pdnNum = -1;
	
    HASH_PCE(pdn,quad);
	
	sch_pedine[quad] = PEDINE.EMPTY;
    sch_mater[col] -= PedinaVal[pdn];
	
	for(index = 0; index < sch_pdnNum[pdn]; ++index) {
		if(sch_pLista[PDNINDEX(pdn,index)] == quad) {
			t_pdnNum = index;
			break;
		}
	}
	
	sch_pdnNum[pdn]--;		
	sch_pLista[PDNINDEX(pdn,t_pdnNum)] = sch_pLista[PDNINDEX(pdn,sch_pdnNum[pdn])];
  
}
//principali movimenti delle pedine//
function AggiungiPedina(quad, pdn) {   
	
	var col = PedinaCol[pdn];

    HASH_PCE(pdn,quad);
	
	sch_pedine[quad] = pdn;  	
	sch_mater[col] += PedinaVal[pdn];
	sch_pLista[PDNINDEX(pdn,sch_pdnNum[pdn])] = quad;
	sch_pdnNum[pdn]++;
}

function MuoviPedina(from, to) {   
	
	var index = 0;
	var pdn = sch_pedine[from];	
	var col = PedinaCol[pdn];	

	HASH_PCE(pdn,from);
	sch_pedine[from] = PEDINE.EMPTY;
	
	HASH_PCE(pdn,to);
	sch_pedine[to] = pdn;	
	
	for(index = 0; index < sch_pdnNum[pdn]; ++index) {
		if(sch_pLista[PDNINDEX(pdn,index)] == from) {
			sch_pLista[PDNINDEX(pdn,index)] = to;
			break;
		}
	}
	
}

function FaituaMossa(mossa) {
	
	var from = FROMSQ(mossa);
    var to = TOSQ(mossa);
    var lato = sch_lato;	
	
	sch_storico[sch_intero].posKey = sch_posChiave;
	
	if( (mossa & MFLAGEP) != 0) {
        if(lato == COLORI.WHITE) {
            CancellaleTracc(to-10);
        } else {
            CancellaleTracc(to+10);
        }
    } else if ( (mossa & MFLAGCA) != 0) {
        switch(to) {
            case QUADRATI.C1:
                MuoviPedina(QUADRATI.A1, QUADRATI.D1);
			break;
            case QUADRATI.C8:
                MuoviPedina(QUADRATI.A8, QUADRATI.D8);
			break;
            case QUADRATI.G1:
                MuoviPedina(QUADRATI.H1, QUADRATI.F1);
			break;
            case QUADRATI.G8:
                MuoviPedina(QUADRATI.H8, QUADRATI.F8);
			break;
            default: break;
        }
    }	
	
	if(sch_enPas != QUADRATI.NO_SQ) HASH_EP();
    HASH_CA();
	
	sch_storico[sch_intero].mossa = mossa;
    sch_storico[sch_intero].fiftyMove = sch_cinquantaMosse;
    sch_storico[sch_intero].enPas = sch_enPas;
    sch_storico[sch_intero].castlePerm = sch_castlePerm;

    sch_castlePerm &= CastlePerm[from];
    sch_castlePerm &= CastlePerm[to];
    sch_enPas = QUADRATI.NO_SQ;

	HASH_CA();
	
	var catturato = CATTURATO(mossa);
    sch_cinquantaMosse++;
	
	if(catturato != PEDINE.EMPTY) {
        CancellaleTracc(to);
        sch_cinquantaMosse = 0;
    }
	
	sch_intero++;
	sch_mezzo++;
	
	if(PedinaPedone[sch_pedine[from]] == BOOL.TRUE) {
        sch_cinquantaMosse = 0;
        if( (mossa & MFLAGPS) != 0) {
            if(lato==COLORI.WHITE) {
                sch_enPas=from+10;
            } else {
                sch_enPas=from-10;
            }
            HASH_EP();
        }
    }
	
	MuoviPedina(from, to);
	
	var prPdn = PROMOTED(mossa);
    if(prPdn != PEDINE.EMPTY)   {       
        CancellaleTracc(to);
        AggiungiPedina(to, prPdn);
    }
		
	sch_lato ^= 1;
    HASH_LATO();
	
	
	if(QuadAttaccato(sch_pLista[PDNINDEX(dueRe[lato],0)], sch_lato))  {
        SubisciMossa();
        return BOOL.FALSE;
    }
	
	return BOOL.TRUE;	
}


function SubisciMossa() {		
	
	sch_intero--;
    sch_mezzo--;
	
    var mossa = sch_storico[sch_intero].mossa;
    var from = FROMSQ(mossa);
    var to = TOSQ(mossa);	
	
	if(sch_enPas != QUADRATI.NO_SQ) HASH_EP();
    HASH_CA();

    sch_castlePerm = sch_storico[sch_intero].castlePerm;
    sch_cinquantaMosse = sch_storico[sch_intero].fiftyMove;
    sch_enPas = sch_storico[sch_intero].enPas;

    if(sch_enPas != QUADRATI.NO_SQ) HASH_EP();
    HASH_CA();

    sch_lato ^= 1;
    HASH_LATO();
	
	if( (MFLAGEP & mossa) != 0) {
        if(sch_lato == COLORI.WHITE) {
            AggiungiPedina(to-10, PEDINE.bP);
        } else {
            AggiungiPedina(to+10, PEDINE.wP);
        }
    } else if( (MFLAGCA & mossa) != 0) {
        switch(to) {
            case QUADRATI.C1: MuoviPedina(QUADRATI.D1, QUADRATI.A1); break;
            case QUADRATI.C8: MuoviPedina(QUADRATI.D8, QUADRATI.A8); break;
            case QUADRATI.G1: MuoviPedina(QUADRATI.F1, QUADRATI.H1); break;
            case QUADRATI.G8: MuoviPedina(QUADRATI.F8, QUADRATI.H8); break;
            default: break;
        }
    }
	
	MuoviPedina(to, from);
	
	var catturato = CATTURATO(mossa);
    if(catturato != PEDINE.EMPTY) {      
        AggiungiPedina(to, catturato);
    }
	
	if(PROMOTED(mossa) != PEDINE.EMPTY)   {        
        CancellaleTracc(from);
        AggiungiPedina(from, (PedinaCol[PROMOTED(mossa)] == COLORI.WHITE ? PEDINE.wP : PEDINE.bP));
    }
}

