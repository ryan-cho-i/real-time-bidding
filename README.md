# Real Time Bidding System

## 1. Implement Video

<!--
<img width="100%" src="https://github.com/CodingStorageofSoo/EcommerceWeb/assets/78337318/d9451558-d702-4853-a11e-b07595589ae9
"/> -->

<video src="https://github.com/CodingStorageofSoo/kafka-redis-js/assets/78337318/2c29fc7b-b42a-493b-865f-de033dba1522" controls="controls" style="max-width: 730px;">
</video>

## 1. Environment

1. Web : ExpressJS

2. Database : MongoDB, Redis

3. DevOps : Kafka, AWS

4. Sure, I see you're trying to describe the architecture of a Real-Time Bidding system. The explanation is overall very clear, but I can help to streamline it and correct a few minor mistakes. Here is the corrected version:

5. **Architecture**

When the client page (http://localhost:${CLIENT_PORT}/) is opened, it sends an HTTP POST REQUEST (http://localhost:${SSP_PORT}/bidRequest/10) to the SSP Server.

Upon receiving the bid request from the client, the SSP Server broadcasts this request to all potential buyers through the DSPs.

The buyers, in response, send back their respective IDs and proposed prices to the SSP Server.

The SSP Server receives these responses and validates their receipt. There could potentially be a 'race condition' at this stage. However, this problem is circumvented by employing Redis.

Redis has several advantages:

1.  Redis operates on a single thread, making it immune to race conditions.
2.  As an in-memory storage solution, Redis offers swift data processing.
3.  Redis supports the SortedSet data structure, which delivers an efficient O(logN) time complexity for both data insertion and retrieval.

Once the bid responses have been sorted using Redis, the results are relayed to consumers via Kafka. The SSP Server serves as a Producer, pushing the message into the message queue.

Two consumers (one for posting the ad and another for data storage) then fetch the message from the queue. This process is asynchronous, thereby optimizing high traffic handling and augmenting the overall speed of operations.

One consumer searches for the winning ad in the database (MongoDB) and sends the ad to the client page. The ad link is CDN-based, thus enabling rapid ad posting.

The other consumer stores the data (logs) in MongoDB.

Finally, after receiving the CDN link for the ad, the client fires the impression pixel.

This basic structural overview depicts a robust system capable of handling advertising bids efficiently while negating potential race conditions using Redis.

Going further, asynchronous processing allows for a non-blocking operation, enhancing the system's efficiency. This is especially beneficial for systems experiencing high traffic, as the tasks of ad posting and data storage do not have to wait for the completion of previous tasks.

Moreover, employing Kafka ensures the reliable delivery of messages. Kafka provides fault tolerance via message replication across multiple servers and ensures that messages are processed in the sequence they were sent, vital for systems where event order matters.

Lastly, by storing data on a separate consumer server, the project enforces the separation of concerns. This division aids in maintaining a clean system architecture, where each component is responsible for a specific function. This approach simplifies not only system organization but also debugging and maintenance.

In conclusion, this architecture provides an efficient approach to handling and distributing ad bids. By harnessing technologies like Redis and Kafka, this system ensures efficient processing, robust handling of potential race conditions, and dependable delivery of messages. It achieves a balance between speed, reliability, and maintainability, making it an ideal solution for high-traffic web platforms seeking efficient ad management.

2. Algorithm
