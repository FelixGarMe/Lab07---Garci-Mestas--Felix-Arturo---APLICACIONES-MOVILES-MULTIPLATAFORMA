import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';

    axios.get(apiUrl)
      .then(async response => {
        const results = response.data.results;
        const detailedData = await Promise.all(
          results.map(async result => {
            const pokemonResponse = await axios.get(result.url);
            return pokemonResponse.data;
          })
        );
        setData(detailedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Pokémon</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.pokemonContainer}>
            <Image
              source={{ uri: item.sprites.front_default }}
              style={styles.pokemonImage}
            />
            <Text style={styles.pokemonName}>{item.name}</Text>
            <View style={styles.statsContainer}>
              {item.stats.map(stat => (
                <View key={stat.stat.name} style={styles.statItem}>
                  <Text style={styles.statName}>{stat.stat.name}:</Text>
                  <Text style={styles.statValue}>{stat.base_stat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pokemonContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  pokemonImage: {
    width: 100,
    height: 100,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    marginHorizontal: 10,
  },
  statName: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
