import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView } from "react-native";
import { style } from "../../styles";
import { HelperText, Searchbar, Text } from "react-native-paper";
import { AxiosContext } from "../../context/AxiosContext";

const isDictEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const isStringEmpty = (str) => {
  return str.length === 0;
};

const QueryScreen = () => {
  const { publicAxios } = useContext(AxiosContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [responseData, setResponseData] = useState({});
  const [visible, setVisible] = useState(false); // for helper text

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (!isStringEmpty(searchQuery)) {
      setVisible(false);
    }
  };

  const clearQueryData = () => {
    setSearchQuery("");
    setResponseData({});
  };

  const getQuery = async () => {
    try {
      if (isStringEmpty(searchQuery)) {
        setVisible(true);
      } else {
        const response = await publicAxios.get(`/stars?name=${searchQuery}`);
        const { data } = response;
        const { content } = data;
        // console.log(content);
        setResponseData({ ...content });
      }
    } catch (error) {
      console.error(error);
      setResponseData({});
    }
  };

  return (
    <SafeAreaView style={style.queryContainer}>
      <StatusBar style="auto" />
      <Searchbar
        style={style.searchBar}
        placeholder="Search by Star Name"
        onChangeText={onChangeSearch}
        onIconPress={getQuery}
        value={searchQuery}
        onClearIconPress={clearQueryData}
        onSubmitEditing={getQuery}
      />
      <HelperText
        style={{ alignSelf: "center" }}
        type="error"
        visible={visible}>
        You must enter a name!
      </HelperText>
      {isDictEmpty(responseData) === false && (
        <ScrollView style={{ marginHorizontal: 20 }}>
          {Object.entries(responseData).map((item, index) => {
            return (
              <Text
                variant="bodyLarge"
                style={{ fontWeight: "bold" }}
                key={index}>{`${item[0]}: ${item[1]}`}</Text>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default QueryScreen;
