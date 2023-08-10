# Real Time Bidding System

## 1. Implement Video

<img width="80%" src="https://github.com/ryan-cho-i/real-time-bidding/assets/78337318/e1d94926-0002-41b0-b4a6-4e2172b70c76"/>

## 2. Environment

1. Web : ExpressJS

2. Database : MongoDB, Redis

3. DevOps : Docker, Kafka, AWS

## 3. System Design

1. When the client page (http://localhost:8080/) is opened, it automatically sends a HTTP POST REQUEST to the SSP Server. (http://localhost:3000/)

2. Upon receiving the bid request from the client, the SSP Server broadcasts this request to all potential buyers through the DSPs. (http://localhost:3001)

3. The buyers, in response, send back their respective IDs and proposed prices to the SSP Server.

4. The SSP Server receives these responses and tracks their sequence.

   - There could potentially be a 'race condition' at this stage. However, this problem is circumvented by employing Redis. (http://localhost:6379/)

5. Once the bid responses have been sorted using Redis, the results are relayed to consumers via Kafka. (http://localhost:9092/)

   - The SSP Server serves as a Producer, pushing the message into the message queue.

6. Two consumers (one for posting the ad and another for data storage) then fetch the message from the queue.

   - This process is asynchronous, thereby optimizing high traffic handling and augmenting the overall speed of operations.

7. Consumer1 searches for the winner's ad in the database (MongoDB) and sends the ad to the client page. (http://localhost:8080/advertisement)

   - The ad link is CDN-based, thus enabling rapid ad posting.

8. Consumer2 stores the data {"fire" : false" , "click" : "false"} in MongoDB.

9. After receiving the CDN link about advertisement, display the advertisement.

10. Check whether the advertisement is displayed. Then, the client fires the impression pixel (http://localhost:3002/firePixel/${id})

11. Whenever data is received ("fire", "click"), Consumer2 update the data.

## 4. Problem & Solution

3. 데이터베이스 접근 속도

4. Ranking System

5. Race Condition

6. 병렬 처리의 어려움

7. 이미지 데이터 저장

## 4. Why Do I use Redis?

Redis has several advantages:

1.  Redis operates on a single thread, making it immune to race conditions.
2.  As an in-memory storage solution, Redis offers swift data processing.
3.  Redis supports the SortedSet data structure, which delivers an efficient O(logN) time complexity for both data insertion and retrieval.

4.  Time Complexity

1) Heap

   - Insertion: O(log N)
   - Deletion: O(log N) (for deleting root), O(N) (for deleting any element)
   - Peek (retrieving max or min): O(1)

2) SortedSet
   - Insertion: O(log N)
   - Deletion: O(log N)
   - Searching: O(log N)

2. Duplicates

1) Heap: A heap allows duplicate values. This means you can insert the value '5' twice in the heap, and it will appear twice.

2) SortedSet: SortedSet doesn't allow insertion of duplicate items. If you attempt to insert a duplicate, the insert operation will simply ignore the request.

## 5. Usage

Download this github repository.

```
git clone https://github.com/ryan-cho-i/real-time-bidding.git
```

Implement docker-compose

```
docker-compose up
```

After typing client address (http://localhost:8080/) on your browser, advertisement will show up

## 6. 어려웠던 점

1. app.get("/", (req, res) => {
   mongoose.connect()
   })

VS

mongoose.connect().then(
app.get("/", (req, res) => { })
)

기본적인 콜백 순서를 바꾸는 것만으로도 많은 속도의 향상을 이뤄냈다.

2. 광고가 표시되었는지 안되었는지 판단하는 함수의 위치

socket.addEventListener("message", ()=>{
image.src = url;
checkAd()
})

vs

image.addEventListener("load", ()=>{
checkAd()
})

socket.addEventListener("message", ()=>{
image.src = url;
})

즉 이미지 로드가 끝난 뒤에, checkAd() 함수를 실행시켜주어야 했다.
