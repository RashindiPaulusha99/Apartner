import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import CryptoJS from 'crypto-js';
import {paymentGatewayPost} from './services/PaymentGatewayService';
import formDatas from 'form-data';
import {v4} from 'uuid';
// import {WebView} from 'react-native-webview';
import moment from 'moment';

const PaymentGateway = ({navigation, route}) => {
  const {cost} = route.params;

  const SECRET_KEY =
    '16d1045d5fd744d6982e21c045fe4507219c4861d4f44ee086e0ec7b9a36f76bee41d48b78dc468ab6ce407b6ec9796e9187ccf48b784cfe8ca49f1c9f6f9b5bbdd1da42a3854bccb5255fef8c49b99ebdf6b43ef0984bc9b1a838dc235bdffe0bee65e209b24191a47d37884686096725c093647b154d94bfba3a7559888a39';

  const [html, setHtml] = useState('');
  useEffect(() => {
    initDataInPage();
  }, []);

  const initDataInPage = async () => {
    let guid = v4();
    let date = moment.utc(new Date()).format();
    let params = {
      access_key: '0985799e630d3e46ab74ca3edf430413',
      amount: cost.toString(),
      currency: 'USD',
      locale: 'en',
      profile_id: 'B45CFAEC-1CD7-4E05-AC4C-2E7819F462EA',
      reference_number: '12223',
      signed_date_time: date,
      signed_field_names:
        'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,bill_to_address_city,bill_to_address_line1,bill_to_address_state,bill_to_address_country,bill_to_forename,bill_to_email,bill_to_surname,bill_to_phone',
      transaction_type: 'authorization',
      transaction_uuid: guid,
      unsigned_field_names: '',
      submit: 'Submit',
      bill_to_address_city: 'test',
      bill_to_address_line1: 'test',
      bill_to_address_state: 'test',
      bill_to_address_country: 'LK',
      bill_to_forename: 'test',
      bill_to_email: 'imandissanayake12@gmail.com',
      bill_to_surname: 'test',
      bill_to_phone: '213123123',
    };

    let encodeString = await sign(buildDataToSign(params), SECRET_KEY);
    params.signature = encodeString;
    const formData = new formDatas();
    const keys = Object.keys(params);
    keys.forEach(elementName => {
      formData.append(elementName, params[elementName]);
    });
    const submitPayment = await paymentGatewayPost(formData);
    setHtml(submitPayment.data);
  };

  const sign = async (data, secretKey) => {
    try {
      var ciphertext = CryptoJS.HmacSHA256(data, secretKey);
      var hashInBase64 = CryptoJS.enc.Base64.stringify(ciphertext);
      return hashInBase64;
    } catch (error) {
      console.log('ERROR!');
    }
  };

  const buildDataToSign = params => {
    let signedFieldNames = [];
    signedFieldNames = params.signed_field_names.split(',');
    let dataToSign = [];
    const loopToDataSign = signedFieldNames.map(item => {
      dataToSign.push(item + '=' + params[item]);
    });
    return commaSeparate(dataToSign);
  };

  const commaSeparate = dataToSign => {
    return dataToSign.toString();
  };

  return (
      <View style={{width:10,height:10}}></View>
    /*<WebView
      originWhitelist={['*']}
      source={{html: html !== '' ? html : '<p>Redirecting...</p>'}}
    />*/
  );
};

const styles = StyleSheet.create({});

export default PaymentGateway;
