function TFR() {
	var i = 0, r = 0;
	for (i = 0; i < sch_intero; ++i)	{
	    if (sch_storico[i].posKey == sch_posChiave) {
		    r++;
		}
	}
	return r;
}

function Dm() {

    if (sch_pdnNum[PEDINE.wP]!=0 || sch_pdnNum[PEDINE.bP]!=0) return BOOL.FALSE;
    if (sch_pdnNum[PEDINE.wQ]!=0 || sch_pdnNum[PEDINE.bQ]!=0 || sch_pdnNum[PEDINE.wR]!=0 || sch_pdnNum[PEDINE.bR]!=0) return BOOL.FALSE;
    if (sch_pdnNum[PEDINE.wB] > 1 || sch_pdnNum[PEDINE.bB] > 1) {return BOOL.FALSE;}
    if (sch_pdnNum[PEDINE.wN] > 1 || sch_pdnNum[PEDINE.bN] > 1) {return BOOL.FALSE;}
    if (sch_pdnNum[PEDINE.wN]!=0 && sch_pdnNum[PEDINE.wB]!=0) {return BOOL.FALSE;}
    if (sch_pdnNum[PEDINE.bN]!=0 && sch_pdnNum[PEDINE.bB]!=0) {return BOOL.FALSE;}
	
    return BOOL.TRUE;
}
