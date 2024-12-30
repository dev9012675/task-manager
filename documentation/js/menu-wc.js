'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">task-manager documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' : 'data-bs-target="#xs-controllers-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' :
                                            'id="xs-controllers-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' : 'data-bs-target="#xs-injectables-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' :
                                        'id="xs-injectables-links-module-AppModule-6c7711cc398c88a9c247f22c9971cce2a1748a1c56b29db1a8483b061d0d9874ad169ce0ef2b680629ff46c7b151d3daabcfd0e2fcc49a6698d28044254045d2"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' :
                                            'id="xs-controllers-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' :
                                        'id="xs-injectables-links-module-AuthModule-faf29c2d9bb41e89d3e316fa78cbbd028d77743ce8548e462820de8139ebba875b73aebefbe41f5859f7a58b6749c88ae8885ae371879ee4c30dcc6760e350e8"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JWTStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JWTStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshJWTStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshJWTStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChatModule.html" data-type="entity-link" >ChatModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailModule-58d56fb210544b37a6e1608e82085038c7d5736ae4fd9b70290df9fd055517abdf6587bcea8ef36e5aacae42bc9c4c52a54b6170714723f645a545822ff284d4"' : 'data-bs-target="#xs-injectables-links-module-MailModule-58d56fb210544b37a6e1608e82085038c7d5736ae4fd9b70290df9fd055517abdf6587bcea8ef36e5aacae42bc9c4c52a54b6170714723f645a545822ff284d4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-58d56fb210544b37a6e1608e82085038c7d5736ae4fd9b70290df9fd055517abdf6587bcea8ef36e5aacae42bc9c4c52a54b6170714723f645a545822ff284d4"' :
                                        'id="xs-injectables-links-module-MailModule-58d56fb210544b37a6e1608e82085038c7d5736ae4fd9b70290df9fd055517abdf6587bcea8ef36e5aacae42bc9c4c52a54b6170714723f645a545822ff284d4"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MessagesModule.html" data-type="entity-link" >MessagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' : 'data-bs-target="#xs-controllers-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' :
                                            'id="xs-controllers-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' }>
                                            <li class="link">
                                                <a href="controllers/MessagesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' : 'data-bs-target="#xs-injectables-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' :
                                        'id="xs-injectables-links-module-MessagesModule-2cc4b411fcf40ecdb21f23cf26e82499c3fa3b70b4f71d3ecc95a338ceeb5282d84e2fb63c01c3391246df58f881c1098f0c292cbff75f6060ed2ca5331f58be"' }>
                                        <li class="link">
                                            <a href="injectables/MessagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NotificationsModule-97ec127458ff39f1e249590dbc120a3a1774e9e71c181bf4cfe6ea7d1cba7c1d6209b6bb6c20bc0c0b7cae3b5d7eb4c70a5ecfdc704ed84815e6b107838d15a0"' : 'data-bs-target="#xs-injectables-links-module-NotificationsModule-97ec127458ff39f1e249590dbc120a3a1774e9e71c181bf4cfe6ea7d1cba7c1d6209b6bb6c20bc0c0b7cae3b5d7eb4c70a5ecfdc704ed84815e6b107838d15a0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-97ec127458ff39f1e249590dbc120a3a1774e9e71c181bf4cfe6ea7d1cba7c1d6209b6bb6c20bc0c0b7cae3b5d7eb4c70a5ecfdc704ed84815e6b107838d15a0"' :
                                        'id="xs-injectables-links-module-NotificationsModule-97ec127458ff39f1e249590dbc120a3a1774e9e71c181bf4cfe6ea7d1cba7c1d6209b6bb6c20bc0c0b7cae3b5d7eb4c70a5ecfdc704ed84815e6b107838d15a0"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoomsModule.html" data-type="entity-link" >RoomsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' : 'data-bs-target="#xs-controllers-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' :
                                            'id="xs-controllers-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' }>
                                            <li class="link">
                                                <a href="controllers/RoomsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' : 'data-bs-target="#xs-injectables-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' :
                                        'id="xs-injectables-links-module-RoomsModule-c130c0ad1bde189c4528e8c48c6de7a8086707c2703f3de973f13fc46081a0f859ed98bd6ca2997cd22ad9c7235be8887e8182bcb17d2a0da9c2d2a25d5d02cf"' }>
                                        <li class="link">
                                            <a href="injectables/RoomsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SeederModule.html" data-type="entity-link" >SeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SeederModule-938f982db6832cfe5bd7da12d0281e7e672c295ae5b4720c80ce2091c6bf665990990056f6470b8ff57df2d2f71d57a1754732cc9ad05d1a29f99ebce4eb2f4d"' : 'data-bs-target="#xs-injectables-links-module-SeederModule-938f982db6832cfe5bd7da12d0281e7e672c295ae5b4720c80ce2091c6bf665990990056f6470b8ff57df2d2f71d57a1754732cc9ad05d1a29f99ebce4eb2f4d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SeederModule-938f982db6832cfe5bd7da12d0281e7e672c295ae5b4720c80ce2091c6bf665990990056f6470b8ff57df2d2f71d57a1754732cc9ad05d1a29f99ebce4eb2f4d"' :
                                        'id="xs-injectables-links-module-SeederModule-938f982db6832cfe5bd7da12d0281e7e672c295ae5b4720c80ce2091c6bf665990990056f6470b8ff57df2d2f71d57a1754732cc9ad05d1a29f99ebce4eb2f4d"' }>
                                        <li class="link">
                                            <a href="injectables/SeederService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripeModule.html" data-type="entity-link" >StripeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' : 'data-bs-target="#xs-controllers-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' :
                                            'id="xs-controllers-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' }>
                                            <li class="link">
                                                <a href="controllers/StripeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' : 'data-bs-target="#xs-injectables-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' :
                                        'id="xs-injectables-links-module-StripeModule-b18ba47ea4d323ea1be46ef805834103b94e14716e165af47f1511623084e88ce4e482b5eed2cd9560dc60bd7aef471bdc763f135d69037edd92b445b7859815"' }>
                                        <li class="link">
                                            <a href="injectables/StripeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' : 'data-bs-target="#xs-controllers-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' :
                                            'id="xs-controllers-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' }>
                                            <li class="link">
                                                <a href="controllers/TasksController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' : 'data-bs-target="#xs-injectables-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' :
                                        'id="xs-injectables-links-module-TasksModule-2162d16ebbcc52466a0c4fdf67e1717df70137d6a7ffcc71f27b058b37eb4042e803b10d6b805fa878cb9d71652879e1b93eb2e1cb9013f5ffecce4bdf321292"' }>
                                        <li class="link">
                                            <a href="injectables/TasksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' :
                                            'id="xs-controllers-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' :
                                        'id="xs-injectables-links-module-UsersModule-df8af56c98b2150f2e852c8f88b6ad98f2c01c6fcfce7d454405cf127239aea5b843218afa29c278e7ea1a8381b4277edb236c5d99a677e8c45fbcd143368c7a"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MessagesController.html" data-type="entity-link" >MessagesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoomsController.html" data-type="entity-link" >RoomsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/StripeController.html" data-type="entity-link" >StripeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TasksController.html" data-type="entity-link" >TasksController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ChatGateway.html" data-type="entity-link" >ChatGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMessageDTO.html" data-type="entity-link" >CreateMessageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNotificationDTO.html" data-type="entity-link" >CreateNotificationDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoomDTO.html" data-type="entity-link" >CreateRoomDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTaskDTO.html" data-type="entity-link" >CreateTaskDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDTO.html" data-type="entity-link" >CreateUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWorkerDTO.html" data-type="entity-link" >CreateWorkerDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailDTO.html" data-type="entity-link" >EmailDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Manager.html" data-type="entity-link" >Manager</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationDTO.html" data-type="entity-link" >PaginationDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReassignWorkerDTO.html" data-type="entity-link" >ReassignWorkerDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Room.html" data-type="entity-link" >Room</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoomSearchDTO.html" data-type="entity-link" >RoomSearchDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchMessageDTO.html" data-type="entity-link" >SearchMessageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskSearchDTO.html" data-type="entity-link" >TaskSearchDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMessageDTO.html" data-type="entity-link" >UpdateMessageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDTO.html" data-type="entity-link" >UpdatePasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoomDTO.html" data-type="entity-link" >UpdateRoomDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTaskDTO.html" data-type="entity-link" >UpdateTaskDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDTO.html" data-type="entity-link" >UpdateUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSearchDTO.html" data-type="entity-link" >UserSearchDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyDTO.html" data-type="entity-link" >VerifyDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Worker.html" data-type="entity-link" >Worker</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JWTStrategy.html" data-type="entity-link" >JWTStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailService.html" data-type="entity-link" >MailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesService.html" data-type="entity-link" >MessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshAuthGuard.html" data-type="entity-link" >RefreshAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshJWTStrategy.html" data-type="entity-link" >RefreshJWTStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoomsService.html" data-type="entity-link" >RoomsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SeederService.html" data-type="entity-link" >SeederService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StripeService.html" data-type="entity-link" >StripeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TasksService.html" data-type="entity-link" >TasksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/TrialGuard.html" data-type="entity-link" >TrialGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/WsJwtGuard.html" data-type="entity-link" >WsJwtGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DeleteMessage.html" data-type="entity-link" >DeleteMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResponse.html" data-type="entity-link" >IResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Payload.html" data-type="entity-link" >Payload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServerToClientEvents.html" data-type="entity-link" >ServerToClientEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Unique.html" data-type="entity-link" >Unique</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});