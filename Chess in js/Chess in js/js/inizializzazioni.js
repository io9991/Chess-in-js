//in questo script verranno inizializzate la maggior parte delle variabili//
//ogni pedina avrà un numero associato; se lo spazio è vuoto verrà contrassegnato con lo 0//
var PEDINE =  { EMPTY : 0, wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6, bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };

var SCH_QUAD_NUM = 120;

var MOSSEMAX = 2048;
var POSIZIONIMAX = 256;
var PROMAX = 64;

var INFINITE = 30000;
var MATE = 29000;
//disposizione iniziale che prevede la classica disposizione degli scacchi//
//cambierà in base alle mosse//
var INIZIO_DISPOSIZIONE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

//si baserà su una griglia che non sarà solamente 8*8, in modo da prendere anche fuoriscacchiera//
var FILE =  { FILA_A:0, FILA_B:1, FILA_C:2, FILA_D:3, FILA_E:4, FILA_F:5, FILA_G:6, FILA_H:7, FILA_NONE:8 };
var COLONNE =  { COLONNA_1:0, COLONNA_2:1, COLONNA_3:2, COLONNA_4:3, COLONNA_5:4, COLONNA_6:5, COLONNA_7:6, COLONNA_8:7, COLONNA_NONE:8 };

var COLORI = { WHITE:0, BLACK:1, BOTH:2 };


var QUADRATI = {
  A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, NO_SQ:99, OFFBOARD:100
};

var BOOL = { FALSE:0, TRUE:1 };

var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };

var FileSch = new Array(SCH_QUAD_NUM);
var ColonneSch = new Array(SCH_QUAD_NUM);

var Quad120toQuad64 = new Array(SCH_QUAD_NUM);
var Quad64toQuad120 = new Array(64);

var PdnChar = ".PNBRQKpnbrqk";
var LatoChar = "wb-";
var ColonnaChar = "12345678";
var FileChar = "abcdefgh";


//inizializzazione pedine//
var PedinaBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PedinaMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PedinaMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PedinaVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PedinaCol = [ COLORI.BOTH, COLORI.WHITE, COLORI.WHITE, COLORI.WHITE, COLORI.WHITE, COLORI.WHITE, COLORI.WHITE,
	COLORI.BLACK, COLORI.BLACK, COLORI.BLACK, COLORI.BLACK, COLORI.BLACK, COLORI.BLACK ];
	
var PedinaPedone = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PedinaCavallo = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PedinaRe = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PedinaTorreRegina = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PedinaAlfiereRegina = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PedinaSds = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var KnDir = [ -8, -19,	-21, -12, 8, 19, 21, 12 ];
var RkDir = [ -1, -10,	1, 10 ];
var BiDir = [ -9, -11, 11, 9 ];
var KiDir = [ -1, -10,	1, 10, -9, -11, 11, 9 ];

var DirNum = [ 0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8 ];
var PdnDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir ];
var LoopSdPdn = [ PEDINE.wB, PEDINE.wR, PEDINE.wQ, 0, PEDINE.bB, PEDINE.bR, PEDINE.bQ, 0 ];
var LoopNonSdPdn = [ PEDINE.wN, PEDINE.wK, 0, PEDINE.bN, PEDINE.bK, 0 ];
var LoopSdIndex = [ 0, 4 ];
var LoopNonSdIndex = [ 0, 3 ];
var dueRe = [PEDINE.wK, PEDINE.bK];

var PedinaChiave = new Array(14 * 120);
var LatoChiave;
var CastleChiave = new Array(16);

var Riflesso64 = [
56	,	57	,	58	,	59	,	60	,	61	,	62	,	63	,
48	,	49	,	50	,	51	,	52	,	53	,	54	,	55	,
40	,	41	,	42	,	43	,	44	,	45	,	46	,	47	,
32	,	33	,	34	,	35	,	36	,	37	,	38	,	39	,
24	,	25	,	26	,	27	,	28	,	29	,	30	,	31	,
16	,	17	,	18	,	19	,	20	,	21	,	22	,	23	,
8	,	9	,	10	,	11	,	12	,	13	,	14	,	15	,
0	,	1	,	2	,	3	,	4	,	5	,	6	,	7
];

var CastlePerm = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];




function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m)  { return (((m)>>7) & 0x7F); }
function CATTURATO(m)  { return (((m)>>14) & 0xF); }
function PROMOTED(m)  { return (((m)>>20) & 0xF); }

var MFLAGEP = 0x40000
var MFLAGPS = 0x80000
var MFLAGCA = 0x1000000

var MFLAGCAP = 0x7C000
var MFLAGPROM = 0xF00000

var NONTIMUOVERE = 0

var PVENTRIES = 10000;

function PDNINDEX(pdn, pdnNum) {
	return (pdn * 10 + pdnNum);
}

function FR2SQ(f,r) {
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}

function QUAD64(quad120) { 
	return Quad120toQuad64[(quad120)];
}

function QUAD120(quad64) {
	return Quad64toQuad120[(quad64)];
}

//la funzione riflesso permette di ribaltare la scacchiera//

function RIFLESSO64(quad) {
	return Riflesso64[quad];
}

function RAND_32() {

	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
		 | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);

}

function SEIFUORISCACCHIERA(quad) {
	if(FileSch[quad]==QUADRATI.OFFBOARD) return BOOL.TRUE;
	return BOOL.FALSE;	
}

function HASH_PCE(pdn,quad) { 
	sch_posChiave ^= PedinaChiave[pdn*120 + quad]; 
}
function HASH_CA() { sch_posChiave ^= CastleChiave[sch_castlePerm]; }
function HASH_LATO() { sch_posChiave ^= LatoChiave; }
function HASH_EP() { sch_posChiave ^= PedinaChiave[sch_enPas]; }


//questi serviranno per poter svolgere alcune funzionalità particolari//
var GameController = {};
GameController.EngineSide = COLORI.BOTH;
GameController.PlayerSide = COLORI.BOTH;
GameController.BoardFlipped = BOOL.FALSE;
GameController.GameOver = BOOL.FALSE;
GameController.BookLoaded = BOOL.FALSE;
GameController.GameSaved = BOOL.TRUE;







