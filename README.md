# Load Balancing avec HAProxy

## 1. Objectif

Ce TP vise à démontrer les principes fondamentaux du **load balancing** à l’aide de **HAProxy**.  
L’objectif est de répartir les requêtes entrantes entre deux serveurs Node.js simples, afin d’illustrer :
- La haute disponibilité
- La résilience
- La performance d’un système distribué

---

## 2. Description du système

Ce système repose sur une architecture simple mais efficace, entièrement déployée sur une machine Linux locale. Il combine trois composants principaux :

### 🔹 Serveurs applicatifs Node.js

Deux serveurs web minimalistes ont été développés en Node.js :
- `server1.js` écoute sur le port **3001**
- `server2.js` écoute sur le port **3002**

Chaque serveur répond à une requête HTTP avec un message distinct, permettant de vérifier visuellement la répartition des requêtes.  
Ces serveurs représentent les **backends applicatifs** du système.

### 🔹 HAProxy — Load Balancer

HAProxy agit comme un **proxy inverse** et un **répartiteur de charge** :
- Il écoute sur le port **80** via le frontend nommé `NodeSrv_front`
- Il redirige les requêtes vers les serveurs Node.js via le backend nommé `NodeSrv_back`
- Il utilise la stratégie d'équilibrage **round-robin** pour répartir équitablement les requêtes

HAProxy constitue le **point d’entrée unique** du système, masquant la complexité des serveurs backend.

### 🔹 Interface de supervision

Une interface de statistiques est exposée sur le port **8080** :
- Accessible via : `http://localhost:8080/stats`
- Permet de visualiser l’état des serveurs, le nombre de requêtes, les erreurs, et les métriques réseau

Cette interface facilite le **monitoring en temps réel** du système.

---

## 3. Configuration de l’environnement

### 🔸 Installation de HAProxy et Node.js


`sudo apt install nodejs npm haproxy -y`


### 🔸 Création des serveurs Node.js

Deux serveurs web simples ont été créés (voir code source).
Ils sont lancés avec les commandes suivantes :

node server1.js
node server2.js


Chaque serveur peut être démarré dans un terminal différent afin de visualiser les logs de requêtes en temps réel.
Les réponses retournées permettent d’identifier clairement depuis quel serveur la requête a été traitée.

### 🔸 Configuration de HAProxy

Modification du fichier de configuration :

sudo nano /etc/haproxy/haproxy.cfg


Contenu ajouté :
```bash
frontend NodeSrv_front
    bind *:80
    default_backend NodeSrv_back

backend NodeSrv_back
    balance roundrobin
    server server1 127.0.0.1:3001 check
    server server2 127.0.0.1:3002 check

listen stats
    bind *:8080
    stats enable
    stats uri /stats
    stats refresh 10s
```

Redémarrage du service : `sudo systemctl restart haproxy`

## 4. Test

Nous avons effectué un test en envoyant 10 requêtes HTTP vers notre application Node.js :

`for i in {1..10}; do curl -s http://localhost; done`

Puis nous avons accédé à l’interface de statistiques : `http://localhost:8080/stats`

## 5. Résultats

- Les réponses s’alternent entre les deux serveurs
- Chacun a reçu 5 sessions de connexion
- La stratégie round-robin est bien appliquée
- Aucun serveur n’est surchargé
- Les deux serveurs sont UP
- La répartition est équitable et stable