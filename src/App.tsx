import React, { useEffect, useState } from 'react';
import {
  Chart,
  PieSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { Typography } from "@material-ui/core";

const startDateString = "2021/7/22";
const endDateString = "2021/8/22";
const startDate = new Date(startDateString).getTime();
const endDate = new Date(`${endDateString} 23:59:59.999`).getTime();
let oldRemain = 0;
let discordWebhook = localStorage.getItem("discodeWebhook");
if(discordWebhook === null) console.log("discord通知はOFFです。");

function App() {
  const nowDate = new Date();
  const [ nowTime, setNowTime ] = useState(nowDate.getTime());
  const [ timeAdvanced, setTimeAdvanced ] = useState(nowDate.getTime() - startDate);
  const [ totalTime, setTotalTime ] = useState(endDate - startDate);
  const [ timeRemaining, setTimeRemaining ] = useState( endDate - startDate - ( nowDate.getTime() - startDate ) );
  const [ percentageRemaining, setPercentageRemaining ] = useState( (endDate - startDate - ( nowDate.getTime() - startDate )) / (endDate - startDate) );
  const [ percentageOfProgress, setPercentageOfProgress ] = useState( ( nowDate.getTime() - startDate ) / (endDate - startDate) );
  const [ chartData, setchartData ] = useState([
    { country: '経過', area: 0 },
    { country: '残り', area: 0 },
  ]);
  useEffect(() => {
    setInterval(() => {
      const nowDate2 = new Date();
      setNowTime(nowDate2.getTime());
      setTimeAdvanced(nowDate2.getTime() - startDate);
      setTotalTime(endDate - startDate);
      setTimeRemaining(endDate - startDate - ( nowDate2.getTime() - startDate) );
      setPercentageRemaining((endDate - startDate - ( nowDate2.getTime() - startDate )) / (endDate - startDate));
      setPercentageOfProgress(( nowDate2.getTime() - startDate ) / (endDate - startDate));
      setchartData([
        { country: '経過', area: ( nowDate2.getTime() - startDate ) / (endDate - startDate) },
        { country: '残り', area: (endDate - startDate - ( nowDate2.getTime() - startDate )) / (endDate - startDate) },
      ]);
      if( ( (( nowDate2.getTime() - startDate ) / (endDate - startDate)) - oldRemain) * 100 > 1 && oldRemain < 1){
        oldRemain = (( nowDate2.getTime() - startDate ) / (endDate - startDate));
        if(discordWebhook !== null){
          fetch(discordWebhook,
            {
              method:"post",
              headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({
                "content": `夏休みが1%経過しました。\r現在${
                  Math.round( ( nowDate2.getTime() - startDate ) * 100 * 1000 / (endDate - startDate) ) / 1000
                }%で、残り${
                  Math.round((endDate - startDate - ( nowDate2.getTime() - startDate )) * 100 * 1000 / (endDate - startDate)) / 1000
                }%です。`
              })
            }
          )
          .then(res => res.json())
          .then(res => console.log(res))
          .catch(err => console.log(err))
        }
      }
    } ,100);
  },[]);
  return (
    <div style={{display:"flex",justifyContent:'space-around'}}>
      <div>
        {/* <p>
          ここに表示したいもの
          - 今日の日時（秒まで）
          - 夏休みの終わり日時（秒まで）
          - 夏休みの進捗パーセント（ミリ秒換算で残りと進み）
            - 残り：残り時間 / 全体の時間
            - 進み : 進んだ時間 / 全体の時間
            - 全体の時間 : 夏休みの終了日時ー開始日時
            - 進んだ時間 : 現在の日時 - 夏休み開始日時
            - 残り時間 : 全体の時間 - 進んだ時間
        </p> */}
        {/* <Typography>{nowTime}</Typography>
        <Typography>{startDate}</Typography>
        <Typography>{endDate}</Typography>
        <Typography>{timeAdvanced}</Typography>
        <Typography>{totalTime}</Typography>
        <Typography>{timeRemaining}</Typography> */}
        <Typography variant="h4">{`開始日${startDateString}`}</Typography>
        <Typography variant="h4">{`終了日${endDateString}`}</Typography>
        <Typography variant="h4">{`今日の日付：${new Date().toLocaleDateString()}`}</Typography>
        <Typography variant="h4">{`残り：${Math.round(percentageRemaining * 100 * 100000) / 100000}%`}</Typography>
        <Typography variant="h4">{`経過：${Math.round(percentageOfProgress * 100 * 100000) / 100000}%`}</Typography>
        <Typography variant="h4">{`残りの日数 : ${Math.round(timeRemaining / 1000 / 60 / 60 / 24)}日`}</Typography>
        <Typography variant="h4">{`残りの時間数 : ${Math.round(timeRemaining / 1000 / 60 / 60)}時間`}</Typography>
        <Typography variant="h4">{`残りの分数 : ${Math.round(timeRemaining / 1000 / 60)}分`}</Typography>
        <Typography variant="h4">{`残りの秒数 : ${Math.round(timeRemaining / 1000)}秒`}</Typography>
        {/* <Typography>{`old : ${oldRemain}`}</Typography> */}
        {
          discordWebhook === null
          ? <Typography>
            localStorageにdiscordWebhookというキーで<br />
            discordのwebhookのURLを設定すると1%毎に通知が送られます。<br />
            うるさいので使わないことをお勧めします。
            </Typography>
          : <Typography>discord通知はONです。</Typography>
        }
      </div>
      <div style={{width:"45%"}}>
        <Chart
            data={chartData}
          >
            <PieSeries
              valueField="area"
              argumentField="country"
            />
            <Legend />
            <Title
              text="経過と残り"
            />
          </Chart>
        </div>
    </div>
  );
}

export default App;
