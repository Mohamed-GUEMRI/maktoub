import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landingp',
  templateUrl: './landingp.component.html',
  styleUrls: ['./landingp.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})


export class LandingpComponent {
  features: any[] = [
    {
      icon: 'fas fa-pen',
      title: 'Write Freely',
      description: 'Express your thoughts without constraints in a supportive environment.'
    },
    {
      icon: 'fas fa-users',
      title: 'Connect with Readers',
      description: 'Build meaningful connections with a community that values authentic voices.'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Discover Ideas',
      description: 'Explore diverse perspectives and stories from across Tunisia.'
    }
  ];

  footerSections: any[] = [
    {
      title: 'Platform',
      links: ['About', 'Features', 'Guidelines']
    },
    {
      title: 'Community',
      links: ['Writers', 'Stories', 'Topics']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact', 'Terms']
    }
  ];

  onStartWriting() {
    console.log('Start Writing clicked');
    // Add navigation logic here
  }

  onCreateAccount() {
    console.log('Create Account clicked');
    // Add account creation logic here
  }

  onFooterLinkClick(link: string) {
    console.log(`Footer link clicked: ${link}`);
    // Add navigation logic here
  }
}
