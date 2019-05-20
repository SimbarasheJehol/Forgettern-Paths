package com.example.vmuser.protecc;

import android.content.ContentValues;
import android.content.Context;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Created by vmuser on 2019/05/16.
 */

public class RegisterActivity extends AppCompatActivity{
    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.register);


        final EditText edname = findViewById(R.id.edname);
        final EditText edsurname = findViewById(R.id.edsurname);
        final EditText edstaffno = findViewById(R.id.edstaffno);
        final EditText edpassword = findViewById(R.id.edpassword);
        final EditText edconfirm = findViewById(R.id.edconfirm);
        TextView tvname = findViewById(R.id.tvname);
        TextView tvsurname = findViewById(R.id.tvsurname);
        TextView tvstaffno = findViewById(R.id.tvstaffno);
        TextView tvpassword = findViewById(R.id.tvpassword);
        TextView tvconfirm = findViewById(R.id.tvconfirm);
        Button Aregister = findViewById(R.id.Aregister);
        Button Gregister = findViewById(R.id.Gregister);


        Aregister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String $name = edname.getText().toString().trim();
                String $surname = edsurname.getText().toString().trim();
                String $number = edstaffno.getText().toString().trim();
                String $pass = edpassword.getText().toString().trim();
                String $comfirm = edconfirm.getText().toString().trim();

                ContentValues cv = new ContentValues();
                cv.put("name", $name);
                cv.put("surname",$surname);
                cv.put("staff_number",$number);
                cv.put("password",$pass);
                Aregister(RegisterActivity.this, cv);
            }
        });


    }
    private static void Aregister( final Context c, ContentValues cv){
        new ServerCommunicator("lamp.ms.wits.ac.za/~s1879247/gSignup.php", cv) {
            @Override
            protected void onPreExecute() {

            }

            @Override
            protected void onPostExecute(String output) {
                if(output.equals("1")){
                    Toast.makeText(c, "registration successful", Toast.LENGTH_SHORT).show();
                }
                else {
                    Toast.makeText(c,"registration unsuccessful", Toast.LENGTH_SHORT).show();
                }
            }
        }.execute();

    }
}
