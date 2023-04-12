//movimenti per le mosse

var PuntidellaVittima = [ 0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600 ];
var MvvLvaPunti = new Array(14 * 14);

function InitMvvLva() {
	var Attacker;
	var Victim;
	for(Attacker = PEDINE.wP; Attacker <= PEDINE.bK; ++Attacker) {
		for(Victim = PEDINE.wP; Victim <= PEDINE.bK; ++Victim) {
			MvvLvaPunti[Victim * 14 + Attacker] = PuntidellaVittima[Victim] + 6 - ( PuntidellaVittima[Attacker] / 100);
		}
	}		
}


function MUOVI(from,to,catturato,promoted,flag) {
	return (from | (to << 7) | (catturato << 14) | (promoted << 20) | flag);
}


function MossaEsistente(mossa) {
	
	GeneraleMosse();
    
	var index;
	var mossaTrovata = NONTIMUOVERE;
	for(index = sch_ListadelleMosseInizio[sch_mezzo]; index < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++index) {
	
		mossaTrovata = sch_ListadelleMosse[index];	
		if(FaituaMossa(mossaTrovata) == BOOL.FALSE) {
			continue;
		
		}				
		SubisciMossa();
		if(mossa == mossaTrovata) {
			return BOOL.TRUE;
		}
	}
	return BOOL.FALSE;
}

function AggiungiMossadiCattura(mossa) {
	sch_ListadelleMosse[sch_ListadelleMosseInizio[sch_mezzo + 1]] = mossa;
	sch_Puntimosse[sch_ListadelleMosseInizio[sch_mezzo + 1]++] = MvvLvaPunti[CATTURATO(mossa) * 14 + sch_pedine[FROMSQ(mossa)]] + 1000000;	
}

function AggiungiQMossa(mossa) {
	sch_ListadelleMosse[sch_ListadelleMosseInizio[sch_mezzo + 1]] = mossa;
	
	if(sch_ricercaKiller[sch_mezzo] == mossa) {	
		sch_Puntimosse[sch_ListadelleMosseInizio[sch_mezzo + 1]] = 900000;
	} else if(sch_ricercaKiller[PROMAX + sch_mezzo] == mossa) {	
		sch_Puntimosse[sch_ListadelleMosseInizio[sch_mezzo + 1]] = 800000;
	} else {	
		sch_Puntimosse[sch_ListadelleMosseInizio[sch_mezzo + 1]] = sch_ricercaStorico[ sch_pedine[FROMSQ(mossa)] * SCH_QUAD_NUM + TOSQ(mossa) ];
	}
	sch_ListadelleMosseInizio[sch_mezzo + 1]++;	
}

function AggiungiEnPassMossa(mossa) {
	sch_ListadelleMosse[sch_ListadelleMosseInizio[sch_mezzo + 1]] = mossa;
	sch_Puntimosse[sch_ListadelleMosseInizio[sch_mezzo + 1]++] = 105 + 1000000;
}

function AggiungiMossadicatturaPedoneBianco(from, to, cap) {
	if(ColonneSch[from]==COLONNE.COLONNA_7) {
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.wQ,0));
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.wR,0));
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.wB,0));
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.wN,0));
	} else {
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.EMPTY,0));	
	}
}

function AddWhitePawnQuietMove(from, to) {
	if(ColonneSch[from]==COLONNE.COLONNA_7) {
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.wQ,0));
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.wR,0));
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.wB,0));
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.wN,0));
	} else {
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.EMPTY,0));	
	}
}

function AggiungiMossadicatturaPedoneNero(from, to, cap) {
	if(ColonneSch[from]==COLONNE.COLONNA_2) {
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.bQ,0));
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.bR,0));
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.bB,0));
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.bN,0));
	} else {
		AggiungiMossadiCattura(MUOVI(from,to,cap,PEDINE.EMPTY,0));	
	}
}

function AddBlackPawnQuietMove(from, to) {
	if(ColonneSch[from]==COLONNE.COLONNA_2) {
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.bQ,0));
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.bR,0));
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.bB,0));
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.bN,0));
	} else {
		AggiungiQMossa(MUOVI(from,to,PEDINE.EMPTY,PEDINE.EMPTY,0));	
	}
}

//Genera la mossa//
function GeneraleMosse() {
	sch_ListadelleMosseInizio[sch_mezzo + 1] = sch_ListadelleMosseInizio[sch_mezzo];
	var pdnType;
	var pdnNum;
	var pdnIndex;
	var pdn;
	var quad;
	var tquad;
	var index;
	if(sch_lato == COLORI.WHITE) {
		pdnType = PEDINE.wP;
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdnType]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdnType,pdnNum)];
			if(sch_pedine[quad + 10] == PEDINE.EMPTY) {
				AddWhitePawnQuietMove(quad, quad+10);
				if(ColonneSch[quad] == COLONNE.COLONNA_2 && sch_pedine[quad + 20] == PEDINE.EMPTY) {
					AggiungiQMossa(MUOVI(quad,(quad+20),PEDINE.EMPTY,PEDINE.EMPTY,MFLAGPS));
				}
			} 
			
			if(SEIFUORISCACCHIERA(quad + 9) == BOOL.FALSE && PedinaCol[sch_pedine[quad + 9]] == COLORI.BLACK) {
				AggiungiMossadicatturaPedoneBianco(quad, quad+9, sch_pedine[quad + 9]);
			}  
			if(SEIFUORISCACCHIERA(quad + 11) == BOOL.FALSE && PedinaCol[sch_pedine[quad + 11]] == COLORI.BLACK) {
				AggiungiMossadicatturaPedoneBianco(quad, quad+11, sch_pedine[quad + 11]);
			} 
			
			if(sch_enPas != QUADRATI.NO_SQ) {
				if(quad + 9 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad + 9,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				} 
				if(quad + 11 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad + 11,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				}
			}
		}
		if(sch_castlePerm & CASTLEBIT.WKCA) {
			if(sch_pedine[QUADRATI.F1] == PEDINE.EMPTY && sch_pedine[QUADRATI.G1] == PEDINE.EMPTY) {
				if(QuadAttaccato(QUADRATI.E1,COLORI.BLACK) == BOOL.FALSE && QuadAttaccato(QUADRATI.F1,COLORI.BLACK) == BOOL.FALSE) {
					AggiungiQMossa(MUOVI(QUADRATI.E1, QUADRATI.G1, PEDINE.EMPTY, PEDINE.EMPTY, MFLAGCA));
				}
			}
		}
		
		if(sch_castlePerm & CASTLEBIT.WQCA) {
			if(sch_pedine[QUADRATI.D1] == PEDINE.EMPTY && sch_pedine[QUADRATI.C1] == PEDINE.EMPTY && sch_pedine[QUADRATI.B1] == PEDINE.EMPTY) {
				if(QuadAttaccato(QUADRATI.E1,COLORI.BLACK) == BOOL.FALSE && QuadAttaccato(QUADRATI.D1,COLORI.BLACK) == BOOL.FALSE ) {
					AggiungiQMossa(MUOVI(QUADRATI.E1, QUADRATI.C1, PEDINE.EMPTY, PEDINE.EMPTY, MFLAGCA));
				}
			}
		}
		
		pdnType = PEDINE.wN; 
		
	} else {
		pdnType = PEDINE.bP;
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdnType]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdnType,pdnNum)];			
			
			if(sch_pedine[quad - 10] == PEDINE.EMPTY) {
				AddBlackPawnQuietMove(quad, quad-10);
				if(ColonneSch[quad] == COLONNE.COLONNA_7 && sch_pedine[quad - 20] == PEDINE.EMPTY) {
					AggiungiQMossa(MUOVI(quad,(quad-20),PEDINE.EMPTY,PEDINE.EMPTY,MFLAGPS));
				}
			} 
			
			if(SEIFUORISCACCHIERA(quad - 9) == BOOL.FALSE && PedinaCol[sch_pedine[quad - 9]] == COLORI.WHITE) {
				AggiungiMossadicatturaPedoneNero(quad, quad-9, sch_pedine[quad - 9]);
			} 
			
			if(SEIFUORISCACCHIERA(quad - 11) == BOOL.FALSE && PedinaCol[sch_pedine[quad - 11]] == COLORI.WHITE) {
				AggiungiMossadicatturaPedoneNero(quad, quad-11, sch_pedine[quad - 11]);
			} 
			if(sch_enPas != QUADRATI.NO_SQ) {
				if(quad - 9 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad - 9,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				} 
				if(quad - 11 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad - 11,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				}
			}
		}
		if(sch_castlePerm & CASTLEBIT.BKCA) {
			if(sch_pedine[QUADRATI.F8] == PEDINE.EMPTY && sch_pedine[QUADRATI.G8] == PEDINE.EMPTY) {
				if(QuadAttaccato(QUADRATI.E8,COLORI.WHITE) == BOOL.FALSE && QuadAttaccato(QUADRATI.F8,COLORI.WHITE) == BOOL.FALSE) {
					AggiungiQMossa(MUOVI(QUADRATI.E8, QUADRATI.G8, PEDINE.EMPTY, PEDINE.EMPTY, MFLAGCA));
				}
			}
		}
		
		if(sch_castlePerm & CASTLEBIT.BQCA) {
			if(sch_pedine[QUADRATI.D8] == PEDINE.EMPTY && sch_pedine[QUADRATI.C8] == PEDINE.EMPTY && sch_pedine[QUADRATI.B8] == PEDINE.EMPTY) {
				if(QuadAttaccato(QUADRATI.E8,COLORI.WHITE) == BOOL.FALSE && QuadAttaccato(QUADRATI.D8,COLORI.WHITE) == BOOL.FALSE ) {
					AggiungiQMossa(MUOVI(QUADRATI.E8, QUADRATI.C8, PEDINE.EMPTY, PEDINE.EMPTY, MFLAGCA));
				}
			}
		}	
		
		pdnType = PEDINE.bN; 
	} 
	
	
	pdnIndex = LoopSdIndex[sch_lato];
	pdn = LoopSdPdn[pdnIndex++];
	while( pdn != 0) {			
		
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
			
			for(index = 0; index < DirNum[pdn]; ++index) {
				dir = PdnDir[pdn][index];
				t_quad = quad + dir;
				
				while(SEIFUORISCACCHIERA(t_quad)==BOOL.FALSE) {				
					
					if(sch_pedine[t_quad] != PEDINE.EMPTY) {
						if( PedinaCol[sch_pedine[t_quad]] == sch_lato ^ 1) {
							AggiungiMossadiCattura(MUOVI(quad, t_quad, sch_pedine[t_quad], PEDINE.EMPTY, 0));
						}
						break;
					}	
					AggiungiQMossa(MUOVI(quad, t_quad, PEDINE.EMPTY, PEDINE.EMPTY, 0));
					t_quad += dir;
				}
			}
		}		
		pdn = LoopSdPdn[pdnIndex++];
	}
	
	pdnIndex = LoopNonSdIndex[sch_lato];
	pdn = LoopNonSdPdn[pdnIndex++];
	
	while( pdn != 0) {	
		
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdn,pdnNum)];			
			
			for(index = 0; index < DirNum[pdn]; ++index) {
				dir = PdnDir[pdn][index];
				t_quad = quad + dir;
				
				if(SEIFUORISCACCHIERA(t_quad) == BOOL.TRUE) {				    
					continue;
				}				
			
				if(sch_pedine[t_quad] != PEDINE.EMPTY) {
					if( PedinaCol[sch_pedine[t_quad]] == sch_lato ^ 1) {
						AggiungiMossadiCattura(MUOVI(quad, t_quad, sch_pedine[t_quad], PEDINE.EMPTY, 0));
					}
					continue;
				}	
				AggiungiQMossa(MUOVI(quad, t_quad, PEDINE.EMPTY, PEDINE.EMPTY, 0));
			}
		}				
		pdn = LoopNonSdPdn[pdnIndex++];
	}

}


function GeneraCattura() {
	sch_ListadelleMosseInizio[sch_mezzo + 1] = sch_ListadelleMosseInizio[sch_mezzo];
	var pdnType;
	var pdnNum;
	var pdnIndex;
	var pdn;
	var quad;
	var tquad;
	var index;
	if(sch_lato == COLORI.WHITE) {
		pdnType = PEDINE.wP;
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdnType]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdnType,pdnNum)];			
			
			if(SEIFUORISCACCHIERA(quad + 9) == BOOL.FALSE && PedinaCol[sch_pedine[quad + 9]] == COLORI.BLACK) {
				AggiungiMossadicatturaPedoneBianco(quad, quad+9, sch_pedine[quad + 9]);
			}  
			if(SEIFUORISCACCHIERA(quad + 11) == BOOL.FALSE && PedinaCol[sch_pedine[quad + 11]] == COLORI.BLACK) {
				AggiungiMossadicatturaPedoneBianco(quad, quad+11, sch_pedine[quad + 11]);
			} 
			
			if(sch_enPas != QUADRATI.NO_SQ) {
				if(quad + 9 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad + 9,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				} 
				if(quad + 11 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad + 11,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				}
			}
		}
		
		pdnType = PEDINE.wN; 
		
	} else {
		pdnType = PEDINE.bP;
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdnType]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdnType,pdnNum)];				
			
			if(SEIFUORISCACCHIERA(quad - 9) == BOOL.FALSE && PedinaCol[sch_pedine[quad - 9]] == COLORI.WHITE) {
				AggiungiMossadicatturaPedoneNero(quad, quad-9, sch_pedine[quad - 9]);
			} 
			
			if(SEIFUORISCACCHIERA(quad - 11) == BOOL.FALSE && PedinaCol[sch_pedine[quad - 11]] == COLORI.WHITE) {
				AggiungiMossadicatturaPedoneNero(quad, quad-11, sch_pedine[quad - 11]);
			} 
			if(sch_enPas != QUADRATI.NO_SQ) {
				if(quad - 9 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad - 9,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				} 
				if(quad - 11 == sch_enPas) {
					AggiungiEnPassMossa(MUOVI(quad,quad - 11,PEDINE.EMPTY,PEDINE.EMPTY,MFLAGEP));
				}
			}
		}
		
		pdnType = PEDINE.bN; 
	} 
	
	
	pdnIndex = LoopSdIndex[sch_lato];
	pdn = LoopSdPdn[pdnIndex++];
	while( pdn != 0) {			
		
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdn,pdnNum)];
			
			for(index = 0; index < DirNum[pdn]; ++index) {
				dir = PdnDir[pdn][index];
				t_quad = quad + dir;
				
				while(SEIFUORISCACCHIERA(t_quad)==BOOL.FALSE) {				
					
					if(sch_pedine[t_quad] != PEDINE.EMPTY) {
						if( PedinaCol[sch_pedine[t_quad]] == sch_lato ^ 1) {
							AggiungiMossadiCattura(MUOVI(quad, t_quad, sch_pedine[t_quad], PEDINE.EMPTY, 0));
						}
						break;
					}
					t_quad += dir;
				}
			}
		}		
		pdn = LoopSdPdn[pdnIndex++];
	}
	
	pdnIndex = LoopNonSdIndex[sch_lato];
	pdn = LoopNonSdPdn[pdnIndex++];
	
	while( pdn != 0) {	
		
		for(pdnNum = 0; pdnNum < sch_pdnNum[pdn]; ++pdnNum) {
			quad = sch_pLista[PDNINDEX(pdn,pdnNum)];			
			
			for(index = 0; index < DirNum[pdn]; ++index) {
				dir = PdnDir[pdn][index];
				t_quad = quad + dir;
				
				if(SEIFUORISCACCHIERA(t_quad) == BOOL.TRUE) {				    
					continue;
				}				
			
				if(sch_pedine[t_quad] != PEDINE.EMPTY) {
					if( PedinaCol[sch_pedine[t_quad]] == sch_lato ^ 1) {
						AggiungiMossadiCattura(MUOVI(quad, t_quad, sch_pedine[t_quad], PEDINE.EMPTY, 0));
					}
					continue;
				}	
			}
		}				
		pdn = LoopNonSdPdn[pdnIndex++];
	}

}