import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MASKS } from 'ng-brazil';
import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public MASKS = MASKS;

  form: FormGroup;
  formDadosEndereco: FormGroup;
  spinner: boolean = false;
  erro: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ){
    this.form = this.formBuilder.group({
      cep: [null, [Validators.required]]
    })

    this.formDadosEndereco = this.formBuilder.group({
      bairro: [null],
      localidade: [null],
      uf: [null]
    })
  }

  consultarCep(cep: string){

    this.spinner = true;
    this.erro = false;
    this.formDadosEndereco.reset();

    cep = cep.replace(/\D/g,'');

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    this.httpClient.get(url, {
      observe: "response"
    })
    .subscribe({
      next: (response) => {

        if(response.status !== 200 || response.body.hasOwnProperty('erro')){
          this.spinner = false;
          this.erro = true;
          console.log('[Ooops, ocorreu um erro!]')
          return;
        }

        setTimeout(() => {
          this.formDadosEndereco.patchValue(response.body);
          this.spinner = false;
          this.erro = false;
        }, 1000);

      },
      error: (error) => {
        this.spinner = false;
        this.erro = true;
        console.log('error', error);
      }
    })
  }

}
