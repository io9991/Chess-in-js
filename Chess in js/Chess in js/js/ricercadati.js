var crc_nodes;
var crc_fh;
var crc_fhf;
var crc_depth;
var crc_tempo;
var crc_inizio;
var crc_fine;
var crc_migliore;
var crc_thinking;

function ControlloGenerale() {
	if( ($.now()-crc_inizio) > crc_tempo ) crc_fine = BOOL.TRUE;
}

function PrevProssimaMossa(MossaNum) {

	var index = 0;
	var migliorPunteggio = 0; 
	var migliorNum = MossaNum;
	
	for (index = MossaNum; index < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++index) {
		if (sch_Puntimosse[index] > migliorPunteggio) {
			migliorPunteggio = sch_Puntimosse[index];
			migliorNum = index;
		}
	}
	
	temp = sch_ListadelleMosse[MossaNum];
	sch_ListadelleMosse[MossaNum] = sch_ListadelleMosse[migliorNum];
	sch_ListadelleMosse[migliorNum] = temp;
	
	temp = sch_Puntimosse[MossaNum];
	sch_Puntimosse[MossaNum] = sch_Puntimosse[migliorNum];
	sch_Puntimosse[migliorNum] = temp;
}

function IsRepetition() {

	var index = 0;

	for(index = sch_intero - sch_cinquantaMosse; index < sch_intero-1; ++index) {				
		if(sch_posChiave == sch_storico[index].posKey) {
			return BOOL.TRUE;
		}
	}	
	return BOOL.FALSE;
}

function CancellaPvTable() {
	
	for(index = 0; index < PVENTRIES; index++) {
			brd_PvTable[index].mossa = NONTIMUOVERE;
			brd_PvTable[index].posKey = 0;
		
	}
}

function ClearForSearch() {
	
	var index = 0;
	var index2 = 0;
	
	for(index = 0; index < 14 * SCH_QUAD_NUM; ++index) {		
		sch_ricercaStorico[index] = 0;	
	}
	
	for(index = 0; index < 3 * PROMAX; ++index) {
		sch_ricercaKiller[index] = 0;
	}	
	
	CancellaPvTable();
		
	sch_mezzo = 0;	
	
	crc_nodes = 0;
	crc_fh = 0;
	crc_fhf = 0;
	crc_inizio = $.now();
	crc_fine = BOOL.FALSE;
}


function Quiescence(alpha, beta) {

	if((crc_nodes & 2047) == 0) ControlloGenerale();
	
	crc_nodes++;
	
	if(IsRepetition() || sch_cinquantaMosse >= 100) {
		return 0;
	}
	
	if(sch_mezzo > PROMAX - 1) {
		return EP();
	}
	
	var Punteggio = EP();
	
	if(Punteggio >= beta) {
		return beta;
	}
	
	if(Punteggio > alpha) {
		alpha = Punteggio;
	}
	
	GeneraCattura();
      
    var MossaNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var MigliorMossa = NONTIMUOVERE;
	Punteggio = -INFINITE;
	var PvMossa = ProbePvTable();	
	
	if( PvMossa != NONTIMUOVERE) {
		for(MossaNum = sch_ListadelleMosseInizio[sch_mezzo]; MossaNum < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++MossaNum) {
			if( sch_ListadelleMosse[MossaNum] == PvMossa) {
				sch_Puntimosse[MossaNum].punti = 2000000;
				break;
			}
		}
	}
	
	for(MossaNum = sch_ListadelleMosseInizio[sch_mezzo]; MossaNum < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++MossaNum)  {	
			
		PrevProssimaMossa(MossaNum);	
		
        if ( FaituaMossa(sch_ListadelleMosse[MossaNum]) == BOOL.FALSE)  {
            continue;
        }
        
		Legal++;
		Punteggio = -Quiescence( -beta, -alpha);
		SubisciMossa();					
		if(crc_fine == BOOL.TRUE) return 0;
		if(Punteggio > alpha) {
			if(Punteggio >= beta) {
				if(Legal==1) {
					crc_fhf++;
				}
				crc_fh++;				
						
				return beta;
			}
			alpha = Punteggio;
			MigliorMossa = sch_ListadelleMosse[MossaNum];			
		}		
    }
	
	if(alpha != OldAlpha) {
		StorePvMossa(MigliorMossa);
	}
	
	return alpha;
}

function AlphaBeta(alpha, beta, depth, DoNull) {

		
	if(depth <= 0) {
		return Quiescence(alpha, beta);
		
	}	
	if((crc_nodes & 2047) == 0) ControlloGenerale();
	
	crc_nodes++;
	
	if((IsRepetition() || sch_cinquantaMosse >= 100) && sch_mezzo != 0) {	
		return 0;
	}
	
	if(sch_mezzo > PROMAX - 1) {
		return EP(pos);
	}
	
	var InCheck = QuadAttaccato(sch_pLista[PDNINDEX(dueRe[sch_lato],0)], sch_lato^1);
	
	if(InCheck == BOOL.TRUE) {
		depth++;
	}
	
	var Punteggio = -INFINITE;
	
	if( DoNull == BOOL.TRUE && BOOL.FALSE == InCheck && 
			sch_mezzo != 0 && (sch_mater[sch_lato] > 50200) && depth >= 4) {
		
		
		var ePStore = sch_enPas;
		if(sch_enPas != QUADRATI.NO_SQ) HASH_EP();
		sch_lato ^= 1;
    	HASH_LATO();
    	sch_enPas = QUADRATI.NO_SQ;
		
		Punteggio = -AlphaBeta( -beta, -beta + 1, depth-4, BOOL.FALSE);
		
		sch_lato ^= 1;
    	HASH_LATO();
		sch_enPas = ePStore;
		if(sch_enPas != QUADRATI.NO_SQ) HASH_EP();
		
		if(crc_fine == BOOL.TRUE) return 0;	
		if (Punteggio >= beta) {		 
		  return beta;
		}	
	}
		
    GeneraleMosse();
      
    var MossaNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var MigliorMossa = NONTIMUOVERE;
	Punteggio = -INFINITE;
	var PvMossa = ProbePvTable();		
	
	if( PvMossa != NONTIMUOVERE) {
		for(MossaNum = sch_ListadelleMosseInizio[sch_mezzo]; MossaNum < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++MossaNum) {
			if( sch_ListadelleMosse[MossaNum] == PvMossa) {
				sch_Puntimosse[MossaNum].punti = 2000000;
				break;
			}
		}
	}
	
	for(MossaNum = sch_ListadelleMosseInizio[sch_mezzo]; MossaNum < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++MossaNum)  {	
			
		PrevProssimaMossa(MossaNum);	
		
        if ( FaituaMossa(sch_ListadelleMosse[MossaNum]) == BOOL.FALSE)  {
            continue;
        }
        
		Legal++;
		Punteggio = -AlphaBeta( -beta, -alpha, depth-1, BOOL.TRUE);
		SubisciMossa();						
		if(crc_fine == BOOL.TRUE) return 0;				
		
		if(Punteggio > alpha) {
			if(Punteggio >= beta) {
				if(Legal==1) {
					crc_fhf++;
				}
				crc_fh++;	
				
				if((sch_ListadelleMosse[MossaNum] & MFLAGCAP) == 0) {
					sch_ricercaKiller[PROMAX + sch_mezzo] = sch_ricercaKiller[sch_mezzo];
					sch_ricercaKiller[sch_mezzo] = sch_ListadelleMosse[MossaNum];
				}				
				return beta;
			}
			alpha = Punteggio;
			MigliorMossa = sch_ListadelleMosse[MossaNum];
			if((MigliorMossa & MFLAGCAP) == 0) {
				sch_ricercaStorico[ sch_pedine[FROMSQ(MigliorMossa)] * SCH_QUAD_NUM + TOSQ(MigliorMossa) ] += depth;
			}
		}		
    }
	
	if(Legal == 0) {
		if(InCheck) {
			return -MATE + sch_mezzo;
		} else {
			return 0;
		}
	}
	
	if(alpha != OldAlpha) {		
		StorePvMossa(MigliorMossa);
	}
	
	return alpha;
} 

var domUpdate_depth;
var domUpdate_mossa;
var domUpdate_punti;
var domUpdate_nodes;
var domUpdate_ordering;

function UpdateDOMStats() {
		var puntiText = "Punteggio: " + (domUpdate_punti/100).toFixed(2);
		if(Math.abs(domUpdate_punti) > MATE-PROMAX) {
			puntiText = "Punteggio: " + "Mate In " + (MATE - Math.abs(domUpdate_punti)) + " mossas";
		}
		
		
		$("#OrderingOut").text("Ordering: " + domUpdate_ordering + "%");
		$("#DepthOut").text("Depth: " + domUpdate_depth);
		$("#PunteggioOut").text(puntiText);
		$("#NodesOut").text("Nodes: " + domUpdate_nodes);
		$("#TimeOut").text("Time: " + (($.now()-crc_inizio)/1000).toFixed(1) + "s");
}

function CercaPos() {
	
	var migliorMossa = NONTIMUOVERE;
	var migliorPunteggio = -INFINITE;
	var currentDepth = 0;	
	var pvNum = 0;
	var linea;
	ClearForSearch();
	
	if(GameController.BookLoaded == BOOL.TRUE) {
		migliorMossa = BM();
	
		if(migliorMossa != NONTIMUOVERE) {
			$("#OrderingOut").text("Ordering:");
			$("#DepthOut").text("Depth: ");
			$("#PunteggioOut").text("Punteggio:");
			$("#NodesOut").text("Nodes:");
			$("#TimeOut").text("Time: 0s");
			$("#BestOut").text("MigliorMossa: " + PrMove(migliorMossa) + '(Book)');
			crc_migliore = migliorMossa;
			crc_thinking = BOOL.FALSE;
			return;
		}
	}
	
	
	for( currentDepth = 1; currentDepth <= crc_depth; ++currentDepth ) {						
		
		migliorPunteggio = AlphaBeta(-INFINITE, INFINITE, currentDepth, BOOL.TRUE);
		if(crc_fine == BOOL.TRUE) break;
		pvNum = GetPvLine(currentDepth);
		migliorMossa = brd_PvArray[0];
		linea = ("Depth:" + currentDepth + " migliore:" + PrMove(migliorMossa) + " Punteggio:" + migliorPunteggio + " nodes:" + crc_nodes); 
		
		if(currentDepth!=1) {
			linea += (" Ordering:" + ((crc_fhf/crc_fh)*100).toFixed(2) + "%");
		}
		console.log(linea);
		
		domUpdate_depth = currentDepth;
		domUpdate_mossa = migliorMossa;
		domUpdate_punti = migliorPunteggio;
		domUpdate_nodes = crc_nodes;
		domUpdate_ordering = ((crc_fhf/crc_fh)*100).toFixed(2);
	}	
		
	$("#BestOut").text("MigliorMossa: " + PrMove(migliorMossa));
	UpdateDOMStats();
	crc_migliore = migliorMossa;
	crc_thinking = BOOL.FALSE;
	
}