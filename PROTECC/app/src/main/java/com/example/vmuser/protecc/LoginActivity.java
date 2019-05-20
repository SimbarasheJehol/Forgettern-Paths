package com.example.vmuser.protecc;

import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);


        final EditText username = findViewById(R.id.username);
        final EditText password = findViewById(R.id.password);
        Button login = findViewById(R.id.login1);
        Button register = findViewById(R.id.Aregister);
        TextView stuff = findViewById(R.id.stuffno);
        TextView password1 = findViewById(R.id.tvpassword);


        register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(LoginActivity.this, RegisterActivity.class));
            }

        });



        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String $User = username.getText().toString().trim();
                String $Password = password.getText().toString().trim();
                //login(LoginActivity.this, $User, $Password);
                login(LoginActivity.this, $User, $Password);
            }

        });

    }
    private static void login(final Context c,String username, String password) {
        ContentValues cv = new ContentValues();
        cv.put("username", username);
        cv.put("password", password);

        new ServerCommunicator("http://1879247@wits.ms.ac.za/~students/login.php", cv) {
            @Override
            protected void onPreExecute() {

            }

            @Override
            protected void onPostExecute(String output) {
                if (output.equals("1")) {
                    Toast.makeText(c, "login successful", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(c, "login failed", Toast.LENGTH_SHORT).show();
                }
            }
        }.execute();

    }



}



