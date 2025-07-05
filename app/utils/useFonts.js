import * as Font from "expo-font"

export async function loadfonts(){
    await Font.loadAsync({
        "Poppins_Bold" : require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins_SemiBold" : require("../../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins_Regular" : require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins_Medium" : require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins_Light" : require("../../assets/fonts/Poppins-Light.ttf"),
    })
}
