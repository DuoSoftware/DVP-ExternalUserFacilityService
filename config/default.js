module.exports = {

    "Redis":
        {
            "mode":"instance",//instance, cluster, sentinel
            "ip": "138.197.90.92",
            "port": 6389,
            "user": "duo",
            "password": "DuoS123",
            "sentinels":{
                "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
                "port":16389,
                "name":"redis-cluster"
            }


        },

    "Security":
        {

            "ip" : "138.197.90.92",
            "port": 6389,
            "user": "duo",
            "password": "DuoS123",
            "mode":"instance",//instance, cluster, sentinel
            "sentinels":{
                "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
                "port":16389,
                "name":"redis-cluster"
            }
        },

    "Mongo":
        {
            "ip":"104.236.231.11",
            "port":"27017",
            "dbname":"dvpdb",
            "password":"DuoS123",
            "user":"duo",
            "replicaset" :"104.236.231.11"
        },

    "Host":{
        "Ip":"0.0.0.0",
        "Port":8819,
        "Version":"1.0.0.0"
    },
    "Token":""
};