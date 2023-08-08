# Real Time Bidding System

## 1. Implement Video

<img width="80%" src="https://github.com/CodingStorageofSoo/kafka-redis-js/assets/78337318/5ad5ef9e-01eb-46d1-875b-a942830537dd"/>

## 2. Environment

1. Web : ExpressJS

2. Database : MongoDB, Redis

3. DevOps : Docker, Kafka, AWS

## 3. Architecture

When the client page (http://localhost:8080/) is opened, it automatically sends a HTTP POST REQUEST to the SSP Server. (http://localhost:3000/)

Upon receiving the bid request from the client, the SSP Server broadcasts this request to all potential buyers through the DSPs. (http://localhost:3001)

The buyers, in response, send back their respective IDs and proposed prices to the SSP Server.

The SSP Server receives these responses and validates their receipt. There could potentially be a 'race condition' at this stage. However, this problem is circumvented by employing Redis. (http://localhost:6379/)

Redis has several advantages:

1.  Redis operates on a single thread, making it immune to race conditions.
2.  As an in-memory storage solution, Redis offers swift data processing.
3.  Redis supports the SortedSet data structure, which delivers an efficient O(logN) time complexity for both data insertion and retrieval.

Once the bid responses have been sorted using Redis, the results are relayed to consumers via Kafka. (http://localhost:9092/) The SSP Server serves as a Producer, pushing the message into the message queue.

Two consumers (one for posting the ad and another for data storage) then fetch the message from the queue. This process is asynchronous, thereby optimizing high traffic handling and augmenting the overall speed of operations.

One consumer searches for the winning ad in the database (MongoDB) and sends the ad to the client page. The ad link is CDN-based, thus enabling rapid ad posting.

The other consumer stores the data (logs) in MongoDB.

Finally, after receiving the CDN link for the ad, the client fires the impression pixel, using Web Socket (http://localhost:8081/) from client server to client.html.

This basic structural overview depicts a robust system capable of handling advertising bids efficiently while negating potential race conditions using Redis.

Going further, asynchronous processing allows for a non-blocking operation, enhancing the system's efficiency. This is especially beneficial for systems experiencing high traffic, as the tasks of ad posting and data storage do not have to wait for the completion of previous tasks.

Moreover, employing Kafka ensures the reliable delivery of messages. Kafka provides fault tolerance via message replication across multiple servers and ensures that messages are processed in the sequence they were sent, vital for systems where event order matters.

Lastly, by storing data on a separate consumer server, the project enforces the separation of concerns. This division aids in maintaining a clean system architecture, where each component is responsible for a specific function. This approach simplifies not only system organization but also debugging and maintenance.

In conclusion, this architecture provides an efficient approach to handling and distributing ad bids. By harnessing technologies like Redis and Kafka, this system ensures efficient processing, robust handling of potential race conditions, and dependable delivery of messages. It achieves a balance between speed, reliability, and maintainability, making it an ideal solution for high-traffic web platforms seeking efficient ad management.

## 4. Algorithm (Heap VS SortedSet (TreeSet in JAVA))

1. Time Complexity

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

Download this github repository (https://github.com/ryan-cho-i/real-time-bidding.git) and type

```
docker-compose up
```

After typing client address (http://localhost:8080/) on your browser, advertisement will show up
