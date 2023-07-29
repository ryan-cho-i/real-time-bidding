#! /bin/bash

# 
echo "Start SSP Server..."
redis-server &
kafka_2.13-2.8.2/bin/zookeeper-server-start.sh kafka_2.13-2.8.2/config/zookeeper.properties &
kafka_2.13-2.8.2/bin/kafka-server-start.sh kafka_2.13-2.8.2/config/server.properties &
kafka_2.13-2.8.2/bin/kafka-topics.sh --create --topic test-topic --bootstrap-server=localhost:9092 
# kafka_2.13-2.8.2/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
node sspServer &

# 
echo "Start DSP Server..."
node dspServer &

#  
echo "Start Consumer Server..."
node consumer2 &
node consumer1 &

# 
echo "Start Client Server..."
node client/clientServer.js &