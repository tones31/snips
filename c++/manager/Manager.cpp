#include <iostream>
#include <vector>
using namespace std;

class Player{
    public:
        Player(string name);
        string name;
};
Player::Player(string name){
    this->name = name;
}

class Manager {
    public:
        ~Manager();
        vector<Player*> players;
        void AddPlayer(Player* player);
        void CreatePlayer(string name);
        void DeletePlayers();
};

Manager::~Manager(){
    this->DeletePlayers();
}

void Manager::AddPlayer(Player* player){
    this->players.push_back(player);
}

void Manager::CreatePlayer(string name){
    Player *player = new Player(name);
    this->AddPlayer(player);
}

void Manager::DeletePlayers(){
    vector<Player*>::iterator it;
    for(it = this->players.begin(); it != this->players.end(); ++it){
        cout << " dalitin";
        delete *it;
    }
}


int main() {
    Manager manager;
    manager.CreatePlayer("bob");
	return 0;
}