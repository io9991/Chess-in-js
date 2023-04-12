function GetPvLine(depth) {;

	var mossa = ProbePvTable();
	var c = 0;
	
	while(mossa != NONTIMUOVERE && c < depth) {
	
		if( MossaEsistente(mossa) ) {
			FaituaMossa(mossa);
			brd_PvArray[c++] = mossa;
			
		} else {
			break;
		
		}		
		mossa = ProbePvTable();	
	}
	
	while(sch_mezzo > 0) {
		SubisciMossa();
	}
	return c;
	
}

function StorePvMossa(mossa) {

	var index = sch_posChiave % PVENTRIES;	
	
	brd_PvTable[index].mossa = mossa;
    brd_PvTable[index].posKey = sch_posChiave;
}

function ProbePvTable() {

	var index = sch_posChiave % PVENTRIES;	
	
	if( brd_PvTable[index].posKey == sch_posChiave ) {
		return brd_PvTable[index].mossa;
		
	}
	
	return NONTIMUOVERE;
}