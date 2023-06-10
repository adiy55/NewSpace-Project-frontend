import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView } from "react-native";
import { style } from "../../styles";
import { Searchbar } from "react-native-paper";

const QueryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  const getQuery = async () => {
    try {
      console.log("Send query to backend!");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar style="auto" />
        <Searchbar
          style={style.searchBar}
          placeholder="Search by Star Name"
          onChangeText={onChangeSearch}
          onIconPress={getQuery}
          value={searchQuery}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default QueryScreen;
