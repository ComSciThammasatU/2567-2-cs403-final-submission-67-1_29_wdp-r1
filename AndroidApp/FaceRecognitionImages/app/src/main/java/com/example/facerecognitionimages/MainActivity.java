package com.example.facerecognitionimages;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;


import com.example.facerecognitionimages.face_recognition.FaceClassifier;

import org.opencv.android.OpenCVLoader;

import java.util.HashMap;


public class MainActivity extends AppCompatActivity {

    //public static HashMap<String, FaceClassifier.Recognition> registered = new HashMap<>();



    Button registerBtn,recognizeBtn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (!OpenCVLoader.initDebug()) {
            Log.d("OpenCV", "Initialization failed");
        } else {
            Log.d("OpenCV", "Initialization successful");
        }

        registerBtn = findViewById(R.id.buttonregister);
        recognizeBtn = findViewById(R.id.buttonrecognize);

        registerBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(MainActivity.this,RegisterActivity.class));
            }
        });

        recognizeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(MainActivity.this,RecognitionActivity.class));
            }
        });
    }
}