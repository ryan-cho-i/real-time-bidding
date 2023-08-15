# Real Time Bidding System

## 1. Implement Video

<img width="80%" src="https://github.com/ryan-cho-i/real-time-bidding/assets/78337318/e1d94926-0002-41b0-b4a6-4e2172b70c76"/>

## 2. Usage

Download this github repository.

```
git clone https://github.com/ryan-cho-i/real-time-bidding.git
```

Implement docker-compose

```
docker-compose up
```

After typing client address (http://localhost:8080/) on your browser, a advertisement and an impression pixel will show up

## 3. Environment

1. Web : ExpressJS

2. Database : MongoDB, Redis

3. DevOps : Docker, Kafka, AWS

## 4. System Design

<img width="80%" src="https://github.com/ryan-cho-i/real-time-bidding/assets/78337318/41402a17-c361-49f5-910f-2e431a0db01a"/>

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

## 5. Problem & Solution

1. Database Access Speed

   - Problem: Slow access speed to the database.
   - Solution: By using Redis, an in-memory database, this solution dramatically improves data retrieval speed, thus reducing latency.

2. Ranking System

   - Problem: High time complexity O(N) in inserting data.
   - Solution: Applying a Redis's Sorted Set (Binary Search Tree), this approach reduces time complexity to O(log N) for insertions and search operations.
   - If the system only needed to identify the top-ranked item, a Heap would have been more appropriate. However, since the plan was to store up to the top 10 ranks in the database, the Sorted Set data structure was selected.

3. Race Condition

   - Problem: Potential issues with simultaneous Responses accessing the same resource.
   - Solution: Since Redis operates on a single-threaded basis, it inherently resolves race conditions.

4. Challenges of Parallel Processing

   - Problem: Bottleneck issues when a single server processes everything.
   - Solution: Implementing Kafka as a Message Broker for distributed processing enables the system to scale and distribute loads efficiently. This is vital for large-scale implementations where horizontal scaling is essential to maintain performance.

5. Image Data Storage

   - Problem: Need for fast access to image data.
   - Solution: Storing images using a CDN optimizes retrieval speed by caching content closer to users. This approach enhances user experience by minimizing load times for frequently accessed content like images.

6. Callback Order Optimization:

   - The position of the MongoDB Connection function.

   ```
   app.get("/", (req, res) => { mongoose.connect() })
   ```

   VS

   ```
   mongoose.connect().then( app.get("/", (req, res) => { }) )
   ```

   - The position of the function that determines whether the advertisement has been displayed or not

   ```
   socket.addEventListener("message", ()=>{
   image.src = url;
   checkAd()
   })
   ```

   vs

   ```
   image.addEventListener("load", ()=>{ checkAd() })
   socket.addEventListener("message", ()=>{ image.src = url; })
   ```

   In other words, the checkAd() function must be executed after the image has finished loading.

7. Various API

- GraphQL
