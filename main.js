function main()
{
}

function setSoundParts() //
{
	var id = "partsListSelect";
	var index = document.getElementById(id).selectedIndex;
	var addText = soundData[index][1];
	//[soundDataの上から数えた値をindexに入る]

	//入っている文字列を取り出す
	var id = "inputTextarea";
	var text = document.getElementById(id).value;

	//付け足したい文字列を追加する
	//テキストが既に入っており、最後の文字が改行でなければ、改行をまず追加する
	if(text != "" && text.slice(-1) != "\n")
		text += "\n";

	text += addText;

	//文字列を返してあげる
	var id = "inputTextarea";
	document.getElementById(id).value = text;

}

//入力内容をクリアする
function resetInput()
{
	var id = "inputTextarea";
	document.getElementById(id).value = "";
}

var inputTextSplit;

function checkInput()
{
	//入っている文字列を取り出す
	var id = "inputTextarea";
	var inputText = document.getElementById(id).value;
	inputTextSplit = inputText.split("\n");

	var judgeFlag = true;
	var NGText = "";
	for(i=0 ; i<inputTextSplit.length ; i++)
	{
		var innerFlag = false;
		var textBuff = inputTextSplit[i];
		//存在する分節かチェックする
		for(j=0 ; j<soundData.length ; j++)
		{
			if(textBuff == soundData[j][1])
			{
				innerFlag = true;
				break;
			}
		}

		if(!innerFlag)
		{
			judgeFlag = false;
			NGText += "\n"+textBuff;
		}
	}

	if(judgeFlag)
	{
	}
	else
	{
		alert("【エラー】以下の文節が認識できませんでした。登録済みの文節を使用してください。\n"+NGText);
		return;
	}

	//もし放送中の場合はキャンセル
	soundStop();

	//音声の事前ロード
	/*
	for(i=0 ; i<inputTextSplit.length ; i++)
	{
		var phrase = inputTextSplit[i];
		var fileName = getFileName(phrase);

		loadSoundFile(fileName);
	}
	 */

	//音声の事前ロード
	for(i=0 ; i<preLoad ; i++)
	{
		//5ファイル以内だった場合スキップ
		if(i>=inputTextSplit.length)
			break;

		var phrase = inputTextSplit[i];
		var fileName = getFileName(phrase);

		loadSoundFile(fileName);
	}

	nowSoundNum = 0;
	setTimeout("soundStart()", 2000)
}

//事前に読み込む音声パーツ数
var preLoad = 5;

//入力　日本語の文字列　出力　ファイル名
function getFileName(phrase)
{
	for(j=0 ; j<soundData.length ; j++)
	{
		if(phrase == soundData[j][1])
		{
			return soundData[j][0];
		}
	}
}

//指定された音声を先にロードだけする
function loadSoundFile(soundFileName)
{
	audio = new Audio(soundFileName);
	audio.load();
}

var nowSoundNum = 0;
audio = new Audio("sound/null-250.mp3");
audio0 = new Audio("sound/null-250.mp3");
audio1 = new Audio("sound/null-250.mp3");


//パーツの音声を再生する
function soundStart()
{
	//ファイル名取得
	var phrase = inputTextSplit[nowSoundNum];
	var fileName = getFileName(phrase);

	//1つ目の場合
	if(nowSoundNum == 0)
	{
		audio0 = new Audio(fileName);
		audio0.play();
	}
	//偶数の場合
	else if(nowSoundNum % 2 == 0)
	{
		audio0.play();
	}
	else
	//奇数の場合
	{
		audio1.play();
	}

	//最後でなければ、次のイベントリスナー貼る
	if(nowSoundNum < inputTextSplit.length-1)
	{
		var phrase = inputTextSplit[nowSoundNum+1];
		var fileName = getFileName(phrase);

		if(nowSoundNum % 2 == 0)
		{
			audio1 = new Audio(fileName);
			audio0.addEventListener('ended', nextSound, false);
		}
		else
		{
			audio0 = new Audio(fileName);
			audio1.addEventListener('ended', nextSound, false);
		}

		//audio.addEventListener('ended', nextSound, false);
	}

	/*
	//最後でなければ、次の放送をセットして流す
	if(nowSoundNum < inputTextSplit.length-1)
	{
		setTimeout("setNextSound()", 30);
	}
	*/

	//5つ先の音声を事前に読み込む
	if(nowSoundNum+5 < inputTextSplit.length)
	{
		var phrase = inputTextSplit[nowSoundNum+5];
		var fileName = getFileName(phrase);

		loadSoundFile(fileName);
	}


	nowSoundNum++;
	//alert(audio.duration)
}

function setNextSound()
{
	var time = audio.duration*1000;
	setTimeout("soundStart()", time);
	log(time);
}

function nextSound(event)
{
	soundStart();
}

var event;



function soundStop()
{
	audio.pause();
}

function log(text)
{
	id = "log";
	document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + "<br />"+text;
}
