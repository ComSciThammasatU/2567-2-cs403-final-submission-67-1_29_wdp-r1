package com.example.facerecognitionimages;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;


import com.example.facerecognitionimages.face_recognition.FaceClassifier;
import com.example.facerecognitionimages.face_recognition.TFLiteFaceRecognition;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetection;
import com.google.mlkit.vision.face.FaceDetector;
import com.google.mlkit.vision.face.FaceDetectorOptions;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileDescriptor;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import android.graphics.RenderEffect;
import android.graphics.Shader;

import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
//import org.opencv.core.Rect;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import fi.iki.elonen.NanoHTTPD;


//public class RecognitionActivity extends AppCompatActivity {
//    CardView galleryCard,cameraCard;
//    ImageView imageView;
//    Uri image_uri;
//    public static final int PERMISSION_CODE = 100;
//
//
//    //TODO declare face detector
//// High-accuracy landmark detection and face classification
//    FaceDetectorOptions highAccuracyOpts =
//            new FaceDetectorOptions.Builder()
//                    .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
//                    .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
//                    .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
//                    .build();
//    FaceDetector detector;
//
//    //TODO declare face recognizer
//    FaceClassifier faceClassifier;
//
//    //TODO get the image from gallery and display it
//    ActivityResultLauncher<Intent> galleryActivityResultLauncher = registerForActivityResult(
//            new ActivityResultContracts.StartActivityForResult(),
//            new ActivityResultCallback<ActivityResult>() {
//                @Override
//                public void onActivityResult(ActivityResult result) {
//                    if (result.getResultCode() == Activity.RESULT_OK) {
//                        image_uri = result.getData().getData();
//                        Bitmap inputImage = uriToBitmap(image_uri);
//                        Bitmap rotated = rotateBitmap(inputImage);
//                        imageView.setImageBitmap(rotated);
//                        performFaceDetection(rotated);
//                    }
//                }
//            });
//
//    //TODO capture the image using camera and display it
//    ActivityResultLauncher<Intent> cameraActivityResultLauncher = registerForActivityResult(
//            new ActivityResultContracts.StartActivityForResult(),
//            new ActivityResultCallback<ActivityResult>() {
//                @Override
//                public void onActivityResult(ActivityResult result) {
//                    if (result.getResultCode() == Activity.RESULT_OK) {
//                        Bitmap inputImage = uriToBitmap(image_uri);
//                        Bitmap rotated = rotateBitmap(inputImage);
//                        imageView.setImageBitmap(rotated);
//                        performFaceDetection(rotated);
//                    }
//                }
//            });
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_recognition);
//
//        //TODO handling permissions
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//            if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED || checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
//                    == PackageManager.PERMISSION_DENIED){
//                String[] permission = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};
//                requestPermissions(permission, PERMISSION_CODE);
//            }
//        }
//
//        //TODO initialize views
//        galleryCard = findViewById(R.id.gallerycard);
//        cameraCard = findViewById(R.id.cameracard);
//        imageView = findViewById(R.id.imageView2);
//
//        //TODO code for choosing images from gallery
//        galleryCard.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
//                galleryActivityResultLauncher.launch(galleryIntent);
//            }
//        });
//
//        //TODO code for capturing images using camera
//        cameraCard.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
//                    if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED || checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
//                            == PackageManager.PERMISSION_DENIED){
//                        String[] permission = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};
//                        requestPermissions(permission, PERMISSION_CODE);
//                    }
//                    else {
//                        openCamera();
//                    }
//                }
//
//                else {
//                    openCamera();
//                }
//            }
//        });
//
//        //TODO initialize face detector
//        detector = FaceDetection.getClient(highAccuracyOpts);
//
//        //TODO initialize face recognition model
//        try {
//            faceClassifier = TFLiteFaceRecognition.create(getAssets(),"facenet.tflite",160,false,getApplicationContext());
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    //TODO opens camera so that user can capture image
//    private void openCamera() {
//        ContentValues values = new ContentValues();
//        values.put(MediaStore.Images.Media.TITLE, "New Picture");
//        values.put(MediaStore.Images.Media.DESCRIPTION, "From the Camera");
//        image_uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
//        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
//        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, image_uri);
//        cameraActivityResultLauncher.launch(cameraIntent);
//    }
//
//    //TODO takes URI of the image and returns bitmap
//    private Bitmap uriToBitmap(Uri selectedFileUri) {
//        try {
//            ParcelFileDescriptor parcelFileDescriptor =
//                    getContentResolver().openFileDescriptor(selectedFileUri, "r");
//            FileDescriptor fileDescriptor = parcelFileDescriptor.getFileDescriptor();
//            Bitmap image = BitmapFactory.decodeFileDescriptor(fileDescriptor);
//
//            parcelFileDescriptor.close();
//            return image;
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        return  null;
//    }
//
//    //TODO rotate image if image captured on samsung devices
//    //TODO Most phone cameras are landscape, meaning if you take the photo in portrait, the resulting photos will be rotated 90 degrees.
//    @SuppressLint("Range")
//    public Bitmap rotateBitmap(Bitmap input){
//        String[] orientationColumn = {MediaStore.Images.Media.ORIENTATION};
//        Cursor cur = getContentResolver().query(image_uri, orientationColumn, null, null, null);
//        int orientation = -1;
//        if (cur != null && cur.moveToFirst()) {
//            orientation = cur.getInt(cur.getColumnIndex(orientationColumn[0]));
//        }
//        Log.d("tryOrientation",orientation+"");
//        Matrix rotationMatrix = new Matrix();
//        rotationMatrix.setRotate(orientation);
//        Bitmap cropped = Bitmap.createBitmap(input,0,0, input.getWidth(), input.getHeight(), rotationMatrix, true);
//        return cropped;
//    }
////    RenderEffect
////    @RequiresApi(api = Build.VERSION_CODES.S)
////    private Bitmap blurBitmapWithRenderEffect(Bitmap input, float radius) {
////        RenderEffect effect = RenderEffect.createBlurEffect(radius, radius, Shader.TileMode.CLAMP);
////
////        Bitmap output = Bitmap.createBitmap(input.getWidth(), input.getHeight(), Bitmap.Config.ARGB_8888);
////        Canvas canvas = new Canvas(output);
////        Paint paint = new Paint();
////        paint.setRenderEffect(effect);
////        canvas.drawBitmap(input, 0, 0, paint);
////
////        return output;
////    }
//
//    private void blurFaceRegion(Bitmap bitmap, Rect faceBounds) {
//        // แปลง Bitmap เป็น Mat
//        Mat imgMat = new Mat();
//        Utils.bitmapToMat(bitmap, imgMat);
//
//        // จำกัดขอบเขตให้อยู่ในภาพ
//        int left = Math.max(faceBounds.left, 0);
//        int top = Math.max(faceBounds.top, 0);
//        int right = Math.min(faceBounds.right, bitmap.getWidth());
//        int bottom = Math.min(faceBounds.bottom, bitmap.getHeight());
//
//        org.opencv.core.Rect roi = new org.opencv.core.Rect(left, top, right - left, bottom - top);
//
//        // คัดเฉพาะส่วนใบหน้ามา blur
//        Mat faceROI = imgMat.submat(roi);
//        Imgproc.GaussianBlur(faceROI, faceROI, new Size(195, 195), 0);
//
//        // กลับมาเป็น Bitmap
//        Utils.matToBitmap(imgMat, bitmap);
//    }
//
//    //TODO perform face detection
//    List<String> hashedTitles = new ArrayList<>();
//    Canvas canvas;
//    public void performFaceDetection(Bitmap input) {
//        Bitmap mutableBmp = input.copy(Bitmap.Config.ARGB_8888,true);
//        canvas = new Canvas(mutableBmp);
//        hashedTitles.clear(); // ล้างรายการก่อนเริ่ม
//
//        InputImage image = InputImage.fromBitmap(input, 0);
//        Task<List<Face>> result =
//                detector.process(image)
//                        .addOnSuccessListener(
//                                new OnSuccessListener<List<Face>>() {
//                                    @Override
//                                    public void onSuccess(List<Face> faces) {
//                                        // Task completed successfully
//                                        // ...
//                                        Log.d("TestFace","Length = "+faces.size());
//                                        for (Face face : faces) {
//                                            Rect bounds = face.getBoundingBox();
//                                            Paint paint = new Paint();
//                                            paint.setColor(Color.RED);
//                                            paint.setStyle(Paint.Style.STROKE);
//                                            paint.setStrokeWidth(3);
//                                            performFaceRecognition(bounds,input);
//                                            blurFaceRegion(mutableBmp, bounds);
//                                            //canvas.drawRect(bounds,paint);
//                                        }
//                                        imageView.setImageBitmap(mutableBmp);
//
//                                        // สร้าง filename แบบมี hash
////                                        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HHmmss", Locale.getDefault()).format(new Date());
////                                        String baseName = "esp32cam1D" + timestamp;
////                                        String filename;
////                                        if (!hashedTitles.isEmpty()) {
////                                            String joinedHashes = TextUtils.join("-", hashedTitles);
////                                            filename = baseName + "__" + joinedHashes + ".jpg";
////                                        } else {
////                                            filename = baseName + ".jpg";
////                                        }
////
////                                        // อัปโหลด
////                                        uploadImageToCloud(mutableBmp, filename);
//                                    }
//                                })
//                        .addOnFailureListener(
//                                new OnFailureListener() {
//                                    @Override
//                                    public void onFailure(@NonNull Exception e) {
//                                        // Task failed with an exception
//                                        Log.e("FaceDetection", "Failed", e);
//                                    }
//                                });
//    }
//
//    //Hash title (name)
//    public String sha256(String input) {
//        try {
//            MessageDigest digest = MessageDigest.getInstance("SHA-256");
//            byte[] hash = digest.digest(input.getBytes("UTF-8"));
//            StringBuilder hexString = new StringBuilder();
//
//            for (byte b : hash) {
//                String hex = Integer.toHexString(0xff & b);
//                if (hex.length() == 1) hexString.append('0');
//                hexString.append(hex);
//            }
//
//            return hexString.toString();
//        } catch (Exception ex) {
//            throw new RuntimeException(ex);
//        }
//    }
//
//    //TODO perform face recognition
//    //String hashedTitle;
//    public void performFaceRecognition(Rect bound,Bitmap input){
//        if(bound.top < 0){
//            bound.top = 0;
//        }
//        if(bound.left < 0){
//            bound.left = 0;
//        }
//        if(bound.right > input.getWidth()){
//            bound.right = input.getWidth()-1;
//        }
//        if(bound.bottom > input.getHeight()){
//            bound.bottom = input.getHeight()-1;
//        }
//        Bitmap croppedFace = Bitmap.createBitmap(input,bound.left,bound.top,bound.width(),bound.height());
//        //imageView.setImageBitmap(croppedFace);
//        croppedFace = Bitmap.createScaledBitmap(croppedFace,160,160,false);
//        FaceClassifier.Recognition recognition = faceClassifier.recognizeImage(croppedFace,false);
//
//        if(recognition != null) {
//            Log.d("tryFR",recognition.getTitle()+ "     "+recognition.getDistance());
//            if(recognition.getDistance() < 1.1) {
//                Paint paint = new Paint();
//                paint.setColor(Color.WHITE);
//                paint.setTextSize(30);
//                canvas.drawText(recognition.getTitle(),bound.left,bound.top,paint);
//                String title = recognition.getTitle();
//                String hash = sha256(title);
//                hashedTitles.add(hash);
//                Log.d("tryFR", hash);
//            }
//        }
//
//    }
//
//    private void uploadImageToCloud(Bitmap bitmap, String filename) {
//        new Thread(() -> {
//            try {
//                URL url = new URL("https://n98wxgzng1.execute-api.us-east-1.amazonaws.com/dev/");
//                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//                connection.setRequestMethod("POST");
//                connection.setRequestProperty("Content-Type", "image/jpeg");
//                connection.setRequestProperty("filename", filename);
//                connection.setDoOutput(true);
//
//                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
//                byte[] imageBytes = byteArrayOutputStream.toByteArray();
//
//                OutputStream os = connection.getOutputStream();
//                os.write(imageBytes);
//                os.close();
//
//                int responseCode = connection.getResponseCode();
//                Log.d("UPLOAD", "Upload complete. Response code: " + responseCode);
//            } catch (Exception e) {
//                Log.e("UPLOAD", "Error uploading image", e);
//            }
//        }).start();
//    }
//
//
//
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//
//    }
//}

// choice 1
//public class RecognitionActivity extends AppCompatActivity {
//
//    private ImageView imageView;
//    private TextView tvResult;
//    private MyHttpServer httpServer;
//
//    private Bitmap latestBitmap;
//    private String latestImageName;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_recognition);
//
//        imageView = findViewById(R.id.imageView2);
//        tvResult = findViewById(R.id.tvResult);
//        Log.d("ip","ip : "+ getLocalIpAddress());
//        notifyEsp32OfAndroidEndpoint();  // แจ้ง ESP32 ให้ใช้ endpoint ใหม่
//        startHttpServer();               // เปิด server รอรับภาพ
//    }
//
//    private void notifyEsp32OfAndroidEndpoint() {
//        new Thread(() -> {
//            try {
//                String androidIp = getLocalIpAddress();
//                String esp32Ip = "172.20.10.5"; // เปลี่ยนตามจริง
//                String url = "http://" + esp32Ip + "/control?var=endpointPostImage&val=http://" + androidIp + ":8080/upload";
//                Log.d("UPLOAD", "url : " + url);
//                okhttp3.OkHttpClient client = new okhttp3.OkHttpClient();
//                okhttp3.Request request = new okhttp3.Request.Builder().url(url).build();
//                okhttp3.Response response = client.newCall(request).execute();
//
//                Log.d("NotifyESP32", "Response: " + response.code());
//
//            } catch (Exception e) {
//                Log.e("NotifyESP32", "Error notifying ESP32", e);
//            }
//        }).start();
//    }
//
//    private String getLocalIpAddress() {
//        try {
//            for (Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces(); interfaces.hasMoreElements(); ) {
//                NetworkInterface intf = interfaces.nextElement();
//                for (InetAddress addr : Collections.list(intf.getInetAddresses())) {
//                    if (!addr.isLoopbackAddress() && (
//                            addr.getHostAddress().startsWith("192.") ||
//                                    addr.getHostAddress().startsWith("10.") ||
//                                    addr.getHostAddress().startsWith("172.")
//                    )) {
//                        return addr.getHostAddress();
//                    }
//                }
//            }
//        } catch (Exception ex) {
//            Log.e("IP", "Error getting local IP", ex);
//        }
//        return "192.168.1.101"; // fallback
//    }
//
//    private void startHttpServer() {
//        try {
//            httpServer = new MyHttpServer();
//            httpServer.start();
//            Toast.makeText(this, "HTTP Server started on port 8080", Toast.LENGTH_SHORT).show();
//        } catch (Exception e) {
//            Log.e("HTTPServer", "Error starting server", e);
//        }
//    }
//
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//        if (httpServer != null) {
//            httpServer.stop();
//        }
//    }
//
//    public class MyHttpServer extends NanoHTTPD {
//        public MyHttpServer() {
//            super(8080);
//        }
//
//        @Override
//        public Response serve(IHTTPSession session) {
//            if (Method.POST.equals(session.getMethod()) && session.getUri().equals("/upload")) {
//                try {
//                    // อ่าน header: ชื่อภาพ
//                    Map<String, String> headers = session.getHeaders();
//                    String imageName = headers.getOrDefault("x-filename", "no-name.jpg");
//
//                    // อ่าน body: ภาพ
//                    session.parseBody(new HashMap<>());
//                    InputStream inputStream = session.getInputStream();
//                    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
//
//                    byte[] data = new byte[4096];
//                    int nRead;
//                    while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
//                        buffer.write(data, 0, nRead);
//                    }
//
//                    buffer.flush();
//                    byte[] imageBytes = buffer.toByteArray();
//
//                    // แปลงเป็น Bitmap
//                    Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
//                    latestBitmap = bitmap;
//                    latestImageName = imageName;
//
//                    // อัปเดต UI
//                    runOnUiThread(() -> {
//                        imageView.setImageBitmap(latestBitmap);
//                        tvResult.setText("ชื่อภาพ: " + latestImageName);
//                    });
//
//                    return newFixedLengthResponse("OK");
//
//                } catch (Exception e) {
//                    Log.e("HTTPServer", "Error receiving image", e);
//                    return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "text/plain", "Upload Failed");
//                }
//            } else {
//                return newFixedLengthResponse("Only POST to /upload supported");
//            }
//        }
//    }
//}

// choice 2
public class RecognitionActivity extends AppCompatActivity {

    CardView galleryCard,cameraCard;
    ImageView imageView;
    Uri image_uri;

    public static final int PERMISSION_CODE = 100;
    //private ImageView imageView;
    private TextView tvResult;

    private final String esp32Ip = "http://172.20.10.5"; // IP จริงของ ESP32

    private Bitmap latestBitmap;
    private String latestImageName;

    private final Handler handler = new Handler();


    private final int intervalMs = 60000; // 1 นาที

    //TODO declare face detector
// High-accuracy landmark detection and face classification
    FaceDetectorOptions highAccuracyOpts =
            new FaceDetectorOptions.Builder()
                    .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                    .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
                    .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
                    .build();
    FaceDetector detector;

    //TODO declare face recognizer
    FaceClassifier faceClassifier;


    //Temporary
    //TODO get the image from gallery and display it
    ActivityResultLauncher<Intent> galleryActivityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        image_uri = result.getData().getData();
                        Bitmap inputImage = uriToBitmap(image_uri);
                        Bitmap rotated = rotateBitmap(inputImage);
                        imageView.setImageBitmap(rotated);
                        performFaceDetection(rotated);
                    }
                }
            });

    //TODO capture the image using camera and display it
//    ActivityResultLauncher<Intent> cameraActivityResultLauncher = registerForActivityResult(
//            new ActivityResultContracts.StartActivityForResult(),
//            new ActivityResultCallback<ActivityResult>() {
//                @Override
//                public void onActivityResult(ActivityResult result) {
//                    if (result.getResultCode() == Activity.RESULT_OK) {
//                        Bitmap inputImage = uriToBitmap(image_uri);
//                        Bitmap rotated = rotateBitmap(inputImage);
//                        imageView.setImageBitmap(rotated);
//                        performFaceDetection(rotated);
//                    }
//                }
//            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recognition);

        imageView = findViewById(R.id.imageView2);
        tvResult = findViewById(R.id.tvResult);

        startAutoFetchLoop(); // ✅ เริ่มลูปทุก 1 นาที

        //TODO handling permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED || checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_DENIED){
                String[] permission = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};
                requestPermissions(permission, PERMISSION_CODE);
            }
        }
//        //TODO initialize views
        //Temporary
        galleryCard = findViewById(R.id.gallerycard);
//        cameraCard = findViewById(R.id.cameracard);
//        imageView = findViewById(R.id.imageView2);

        //Temporary
        //TODO code for choosing images from gallery
        galleryCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                galleryActivityResultLauncher.launch(galleryIntent);
            }
        });
//
//        //TODO code for capturing images using camera
//        cameraCard.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
//                    if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED || checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
//                            == PackageManager.PERMISSION_DENIED){
//                        String[] permission = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};
//                        requestPermissions(permission, PERMISSION_CODE);
//                    }
//                    else {
//                        openCamera();
//                    }
//                }
//
//                else {
//                    openCamera();
//                }
//            }
//        });

        //TODO initialize face detector
        detector = FaceDetection.getClient(highAccuracyOpts);

        //TODO initialize face recognition model
        try {
            faceClassifier = TFLiteFaceRecognition.create(getAssets(),"facenet.tflite",160,false,getApplicationContext());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

//    //TODO opens camera so that user can capture image
//    private void openCamera() {
//        ContentValues values = new ContentValues();
//        values.put(MediaStore.Images.Media.TITLE, "New Picture");
//        values.put(MediaStore.Images.Media.DESCRIPTION, "From the Camera");
//        image_uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
//        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
//        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, image_uri);
//        cameraActivityResultLauncher.launch(cameraIntent);
//    }

    //Temporary
    //TODO takes URI of the image and returns bitmap
    private Bitmap uriToBitmap(Uri selectedFileUri) {
        try {
            ParcelFileDescriptor parcelFileDescriptor =
                    getContentResolver().openFileDescriptor(selectedFileUri, "r");
            FileDescriptor fileDescriptor = parcelFileDescriptor.getFileDescriptor();
            Bitmap image = BitmapFactory.decodeFileDescriptor(fileDescriptor);

            parcelFileDescriptor.close();
            return image;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return  null;
    }

    //TODO rotate image if image captured on samsung devices
    //TODO Most phone cameras are landscape, meaning if you take the photo in portrait, the resulting photos will be rotated 90 degrees.
    @SuppressLint("Range")
    public Bitmap rotateBitmap(Bitmap input){
        String[] orientationColumn = {MediaStore.Images.Media.ORIENTATION};
        Cursor cur = getContentResolver().query(image_uri, orientationColumn, null, null, null);
        int orientation = -1;
        if (cur != null && cur.moveToFirst()) {
            orientation = cur.getInt(cur.getColumnIndex(orientationColumn[0]));
        }
        Log.d("tryOrientation",orientation+"");
        Matrix rotationMatrix = new Matrix();
        rotationMatrix.setRotate(orientation);
        Bitmap cropped = Bitmap.createBitmap(input,0,0, input.getWidth(), input.getHeight(), rotationMatrix, true);
        return cropped;
    }

    // Blur faces
    private void blurFaceRegion(Bitmap bitmap, Rect faceBounds) {
        // แปลง Bitmap เป็น Mat
        Mat imgMat = new Mat();
        Utils.bitmapToMat(bitmap, imgMat);

        // จำกัดขอบเขตให้อยู่ในภาพ
        int left = Math.max(faceBounds.left, 0);
        int top = Math.max(faceBounds.top, 0);
        int right = Math.min(faceBounds.right, bitmap.getWidth());
        int bottom = Math.min(faceBounds.bottom, bitmap.getHeight());

        org.opencv.core.Rect roi = new org.opencv.core.Rect(left, top, right - left, bottom - top);

        // คัดเฉพาะส่วนใบหน้ามา blur
        Mat faceROI = imgMat.submat(roi);
        Imgproc.GaussianBlur(faceROI, faceROI, new Size(195, 195), 0);

        // กลับมาเป็น Bitmap
        Utils.matToBitmap(imgMat, bitmap);
    }

    //TODO perform face detection
    List<String> hashedTitles = new ArrayList<>();
    Canvas canvas;
    public void performFaceDetection(Bitmap input) {
        Bitmap mutableBmp = input.copy(Bitmap.Config.ARGB_8888,true);
        canvas = new Canvas(mutableBmp);
        hashedTitles.clear(); // ล้างรายการก่อนเริ่ม

        InputImage image = InputImage.fromBitmap(input, 0);
        Task<List<Face>> result =
                detector.process(image)
                        .addOnSuccessListener(
                                new OnSuccessListener<List<Face>>() {
                                    @Override
                                    public void onSuccess(List<Face> faces) {
                                        // Task completed successfully
                                        // ...
                                        Log.d("TestFace","Length = "+faces.size());
                                        for (Face face : faces) {
                                            Rect bounds = face.getBoundingBox();
                                            Paint paint = new Paint();
                                            paint.setColor(Color.RED);
                                            paint.setStyle(Paint.Style.STROKE);
                                            paint.setStrokeWidth(3);
                                            performFaceRecognition(bounds,input);
                                            blurFaceRegion(mutableBmp, bounds);
                                            //canvas.drawRect(bounds,paint);
                                        }
                                        imageView.setImageBitmap(mutableBmp);

                                        //Temporary
                                        // สร้าง filename แบบมี hash
//                                        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HHmmss", Locale.getDefault()).format(new Date());
//                                        String baseName = "esp32cam1D" + timestamp;
                                        String filename;
//                                        if (!hashedTitles.isEmpty()) {
//                                            String joinedHashes = TextUtils.join("-", hashedTitles);
//                                            filename = baseName + "__" + joinedHashes;
//                                        } else {
//                                            filename = baseName;
//                                        }

                                        if (!hashedTitles.isEmpty()) {
                                            String joinedHashes = TextUtils.join("-", hashedTitles);
                                            filename = latestImageName + "__" + joinedHashes;
                                        } else {
                                            filename = latestImageName;
                                        }

                                        // อัปโหลด
                                        uploadImageToCloud(mutableBmp, filename);
                                    }
                                })
                        .addOnFailureListener(
                                new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        // Task failed with an exception
                                        Log.e("FaceDetection", "Failed", e);
                                    }
                                });
    }

    //Hash title (name)
    public String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    String hash;
    //TODO perform face recognition
    //String hashedTitle;
    public void performFaceRecognition(Rect bound,Bitmap input){
        if(bound.top < 0){
            bound.top = 0;
        }
        if(bound.left < 0){
            bound.left = 0;
        }
        if(bound.right > input.getWidth()){
            bound.right = input.getWidth()-1;
        }
        if(bound.bottom > input.getHeight()){
            bound.bottom = input.getHeight()-1;
        }
        Bitmap croppedFace = Bitmap.createBitmap(input,bound.left,bound.top,bound.width(),bound.height());
        //imageView.setImageBitmap(croppedFace);
        croppedFace = Bitmap.createScaledBitmap(croppedFace,160,160,false);
        FaceClassifier.Recognition recognition = faceClassifier.recognizeImage(croppedFace,false);

        if(recognition != null) {
            Log.d("tryFR",recognition.getTitle()+ "     "+recognition.getDistance());
            if(recognition.getDistance() < 1.0) {
//                Paint paint = new Paint();
//                paint.setColor(Color.WHITE);
//                paint.setTextSize(30);
//                canvas.drawText(recognition.getTitle(),bound.left,bound.top,paint);
                String title = recognition.getTitle();
                hash = sha256(title);
                hashedTitles.add(hash);
                Log.d("tryFR", hash);
            }
        }

    }

    private void uploadImageToCloud(Bitmap bitmap, String filename) {
        new Thread(() -> {
            try {
                // 1. สร้าง URL โดยใส่ folder + epoch ใน path
                String urlString = "https://gtvy8h0687.execute-api.us-east-1.amazonaws.com/dev/testesp32/" + filename;


                URL url = new URL(urlString);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("POST");
                Log.d("UPLOAD", "url 1 : " + urlString);

                // 2. Content-Type ต้องตรงกับ mapping template
                connection.setRequestProperty("Content-Type", "image/jpg");
                connection.setDoOutput(true);
                Log.d("UPLOAD", "url 2 : " + urlString);

                // 3. แปลง bitmap → byte[]
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] imageBytes = byteArrayOutputStream.toByteArray();
                Log.d("UPLOAD", "url 3 : " + urlString);

                // 4. เขียนข้อมูล binary ไปใน body
                OutputStream os = connection.getOutputStream();
                Log.d("UPLOAD", "url 3.1 : " + urlString);
                os.write(imageBytes);
                Log.d("UPLOAD", "url 3.2 : " + urlString);
                os.close();
                Log.d("UPLOAD", "url 4 : " + urlString);

                int responseCode = connection.getResponseCode();
                Log.d("UPLOAD", "Upload complete. Response code: " + responseCode);

            } catch (Exception e) {
                Log.e("UPLOAD", "Error uploading image: " + e.getMessage(), e);
            }

        }).start();
    }

    private void startAutoFetchLoop() {
        handler.post(fetchRunnable);
    }

    private final Runnable fetchRunnable = new Runnable() {
        @Override
        public void run() {
            fetchImageAndName();
            handler.postDelayed(this, intervalMs); // ลูปอีกครั้งในอีก 60 วิ
        }
    };

    private void fetchImageAndName() {
        new Thread(() -> {
            try {
                // 1. ดึงชื่อภาพ
                URL nameUrl = new URL(esp32Ip + "/imagename");
                HttpURLConnection nameConn = (HttpURLConnection) nameUrl.openConnection();
                nameConn.setDoInput(true);
                nameConn.connect();
                BufferedReader reader = new BufferedReader(new InputStreamReader(nameConn.getInputStream()));
                String name = reader.readLine();
                latestImageName = name;
                Log.d("imgname","imagename : "+ latestImageName);

                // 2. ดึงภาพ
                URL imgUrl = new URL(esp32Ip + "/capture");
                HttpURLConnection imgConn = (HttpURLConnection) imgUrl.openConnection();
                imgConn.setDoInput(true);
                imgConn.connect();
                InputStream input = imgConn.getInputStream();
                Bitmap bitmap = BitmapFactory.decodeStream(input);
                latestBitmap = bitmap;

                runOnUiThread(() -> {
                    imageView.setImageBitmap(latestBitmap);
                    tvResult.setText("ชื่อภาพ: " + latestImageName);
                    performFaceDetection(latestBitmap);
                });

            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> Toast.makeText(this, "โหลดภาพหรือชื่อไม่สำเร็จ", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }



    @Override
    protected void onDestroy() {
        super.onDestroy();

    }
}
