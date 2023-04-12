var perft_leafNodes;

function Perft(depth) { 
	MakeNullMove();
	if(sch_posChiave !=  GeneralaPosizionechiave())  {
		console.log(vediamolalineadigioco());
		MostraScacchiera();
		crc_fine = BOOL.TRUE;
		console.log('Hash Error After Make');
	}   
	
	TakeNullMove();
	if(sch_posChiave !=  GeneralaPosizionechiave())  {
		console.log(vediamolalineadigioco());
		MostraScacchiera();
		crc_fine = BOOL.TRUE;
		console.log('Hash Error After Take');
	}   

	if(depth == 0) {
        perft_leafNodes++;
        return;
    }	

    GeneraleMosse();
    
	var index;
	var mossa;
	for(index = sch_ListadelleMosseInizio[sch_mezzo]; index < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++index) {
	
		mossa = sch_ListadelleMosse[index];	
		if(FaituaMossa(mossa) == BOOL.FALSE) {
			continue;
		}		
		Perft(depth-1);
		SubisciMossa();
	}

    return;
}

function PerftTest(depth) {    

	MostraScacchiera();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;
	GeneraleMosse();
	var index;
	var mossa;
	var MossaNum = 0;
	for(index = sch_ListadelleMosseInizio[sch_mezzo]; index < sch_ListadelleMosseInizio[sch_mezzo + 1]; ++index) {
	
		mossa = sch_ListadelleMosse[index];	
		if(FaituaMossa(mossa) == BOOL.FALSE) {
			continue;
		}	
		MossaNum++;	
        var cumnodes = perft_leafNodes;
		Perft(depth-1);
		SubisciMossa();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("mossa:" + MossaNum + " " + PrMove(mossa) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");
        $("#FenOutput").text("Test Complete : " + perft_leafNodes + " leaf nodes visited");

    return;
}